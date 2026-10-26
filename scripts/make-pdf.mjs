// Makes the printable A4 PDF of one notebook from the built site.
//
//   npm run build
//   node scripts/make-pdf.mjs running-your-own-models
//
// Needs Google Chrome (version 131 or newer, for page footers) and Poppler (`brew install poppler`)
// for pdftotext and pdfunite. The PDF is written to public/<notebook>.pdf.
// Set CHROME=/path/to/chrome if Chrome is not in the usual macOS place.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const nb = process.argv[2];
if (!nb) throw new Error('Usage: node scripts/make-pdf.mjs <notebook-slug>');
const ROOT = resolve('.');
const DIST = join(ROOT, 'dist', 'notebooks', nb);
const SRC = join(ROOT, 'src', 'content', 'notebooks', nb);
if (!existsSync(DIST)) throw new Error(`No built pages in ${DIST}. Run "npm run build" first.`);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = join(ROOT, 'public', `${nb}.pdf`);
const TMP = join(ROOT, 'dist', '.pdf-work');
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// ---- read the built pages ----
const page = (p) => readFileSync(join(DIST, p, 'index.html'), 'utf8');
const article = (html) => {
  const start = html.indexOf('<article class="paper">');
  const nav = html.indexOf('<nav class="pagenav"', start);
  const end = nav > -1 ? nav : html.indexOf('</article>', start);
  return html.slice(start + '<article class="paper">'.length, end);
};
const coverHtml = page('');
const css = [...coverHtml.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
const fontLinks = css.filter((h) => h.startsWith('http')).map((h) => `<link rel="stylesheet" href="${h}">`).join('\n');
const siteCss = css.filter((h) => !h.startsWith('http'))
  .map((h) => readFileSync(join(ROOT, 'dist', h.replace(/^\/[^/]+\//, '')), 'utf8')).join('\n');

// chapters, in order, with their front matter
const fm = (text, key) => (text.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1];
const chapters = readdirSync(SRC).filter((f) => f.endsWith('.mdx')).sort().map((f) => {
  const t = readFileSync(join(SRC, f), 'utf8');
  return { slug: f.replace(/\.mdx$/, ''), number: Number(fm(t, 'number')), title: fm(t, 'title'), kicker: fm(t, 'kicker'), question: fm(t, 'question') };
}).sort((a, b) => a.number - b.number);
const nbTitle = (coverHtml.match(/<h1 class="hero-title">(.*?)<\/h1>/s) || [])[1].replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();

// ---- the print styles ----
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const footer = (name, text) => `@page ${name} { @bottom-left { content: "${esc(text)}"; font: 9.5pt Kalam, cursive; color: #5d6166; vertical-align: middle; } }`;
const printCss = `
@page { size: A4; margin: 15mm 15mm 19mm;
  @bottom-right { content: counter(page); font: 700 9pt Inter, sans-serif; color: #fff; background: #1b1b1b; border-radius: 4px; padding: 3px 0; margin: 7mm 0 7mm auto; width: 10mm; text-align: center; vertical-align: middle; }
  @bottom-left { vertical-align: middle; } }
@page cover { margin: 11mm; @bottom-right { content: none; background: none; } }
${footer('how', 'How to use this notebook')}
${footer('back', 'Word list and answers')}
${chapters.map((c) => footer(`ch${c.number}`, `Chapter ${c.number} · ${c.title}`)).join('\n')}
html { font-size: 14px !important; }
body { background: #fff !important; }
.bar, .toc, .pagenav, .foot, .contribute, #resume, .actions { display: none !important; }
.layout { display: block !important; padding: 0 !important; max-width: none !important; }
.paper { border: 0 !important; box-shadow: none !important; padding: 0 !important; max-width: none !important; border-radius: 0 !important; }
/* keep the wide layout: the A4 page is narrower than the site's mobile breakpoints */
.two { flex-direction: row !important; } .two > * { width: auto !important; }
.nsq .fb, .take ul { column-count: 2 !important; }
.card { flex-direction: row !important; } .card .cl { width: 31% !important; border-right: 2px solid var(--ink) !important; border-bottom: 0 !important; } .card .cr { width: 69% !important; }
.paper table:not(.fo) { display: table !important; }
.sticky { width: auto !important; }
.paper pre.astro-code { white-space: pre-wrap !important; word-break: break-word; font-size: .66rem !important; }
.fbox, .card, .sticky, figure, .qa { break-inside: avoid; }
.paper tr { break-inside: avoid; }  /* long tables may split, but never inside a row */
h2, h3 { break-after: avoid; }
section.chapter { break-before: page; }
section.how { page: how; } section.back { page: back; }
${chapters.map((c) => `section.ch${c.number} { page: ch${c.number}; }`).join('\n')}
/* cover */
.cover { page: cover; height: 274mm; border: 2.5px solid #1b1b1b; padding: 13mm 13mm 9mm; display: flex; flex-direction: column; }
.cover .hero-top { flex-direction: row !important; }
.cover .badge { width: 112px !important; height: 112px !important; font-size: .85rem !important; margin: 0 !important; align-self: flex-start !important; }
.cover .hero-title { font-size: 3.4rem !important; }
.cover .scene { margin: 6mm 0 2mm; }
.cover .byline { margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; }
.cover .byline br { display: none; }
pre code { padding: 0 !important; }
.prov { break-after: avoid; }
.prov:has(+ .tw > table.steps), .prov:has(+ p + .tw > table.steps) { break-before: page; }  /* each deploy recipe on its own page */
.tw { break-inside: avoid; overflow: visible !important; }
.paper table.steps tr:first-child { break-after: avoid; }
.paper table.steps tr { break-inside: avoid; }
section.how .fig { max-width: 300px; margin: 6px auto 4px; }
.two { margin-bottom: 12px; }
.head-checked { margin: 4px 0 0 !important; font-size: .78rem !important; }
.toc-table td.pg { text-align: right; font-weight: 700; font-family: var(--f-sans); }
`;

const shell = (body, title) => `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><title>${title}</title>
${fontLinks}<style>${siteCss}\n${printCss}</style></head><body>${body}</body></html>`;

// ---- the cover (its own PDF, so the page numbers start at the first inside page) ----
let cover = article(coverHtml)
  .replace(/<div class="actions">[\s\S]*?<\/div>/, '');
writeFileSync(join(TMP, 'cover.html'), shell(`<article class="paper"><div class="cover">${cover}</div></article>`, nbTitle));

// ---- the inside pages ----
const how = article(page('how'))
  .replace(/<section class="chapter">/, '<section class="chapter how">')
  .replace(/<h2>What's inside<\/h2>[\s\S]*$/, '%%TOC%%</section>');
const body = (pages) => {
  const toc = `<h2>What's inside</h2><div class="tw"><table class="t toc-table"><tr><th style="width:6%">#</th><th style="width:34%">Chapter</th><th>The question it answers</th><th style="width:8%;text-align:right">Page</th></tr>
${chapters.map((c) => `<tr><td>${c.number}</td><td>${c.title}</td><td>${c.question}</td><td class="pg">${pages[`ch${c.number}`] ?? ''}</td></tr>`).join('\n')}
<tr><td></td><td>Back of the book</td><td>Word list and exercise answers.</td><td class="pg">${pages.back ?? ''}</td></tr></table></div>`;
  const parts = [how.replace('%%TOC%%', toc)];
  for (const c of chapters) {
    let html = article(page(c.slug)).replace(/<section class="chapter">/, `<section class="chapter ch${c.number}">`);
    // Print the "facts last checked" line under the chapter title, so it can never sit alone on a page.
    const checked = (html.match(/<p class="checked">[\s\S]*?<\/p>/) || [''])[0];
    if (checked) html = html.replace(checked, '').replace(/(<div class="ch-sub">[\s\S]*?<\/div>)/, `$1${checked.replace('<p class="checked">', '<p class="checked head-checked">')}`);
    parts.push(html);
  }
  parts.push(article(page('back')).replace(/<section class="chapter">/, '<section class="chapter back">'));
  return shell(`<article class="paper">${parts.join('\n')}</article>`, nbTitle);
};

const print = (html, pdf) => {
  const file = join(TMP, html);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=10000',
    `--print-to-pdf=${pdf}`, pathToFileURL(file).href], { stdio: 'ignore' });
};

// pass 1: print, then find the page each chapter starts on
writeFileSync(join(TMP, 'body.html'), body({}));
print('body.html', join(TMP, 'body.pdf'));
const findPages = () => {
  const n = Number(execFileSync('pdfinfo', [join(TMP, 'body.pdf')]).toString().match(/Pages:\s+(\d+)/)[1]);
  const found = {};
  for (let i = 1; i <= n; i++) {
    const t = execFileSync('pdftotext', ['-f', String(i), '-l', String(i), '-layout', join(TMP, 'body.pdf'), '-']).toString();
    for (const c of chapters) if (!found[`ch${c.number}`] && t.includes(c.kicker)) found[`ch${c.number}`] = i;
    if (!found.back && /Back of the book/.test(t) && /Word list and answers/.test(t) && i > 2) found.back = i;
  }
  return found;
};
const pages = findPages();
const missing = chapters.filter((c) => !pages[`ch${c.number}`]).map((c) => c.number);
if (missing.length) throw new Error(`Could not find the first page of chapters ${missing.join(', ')}`);

// pass 2: print again with the page numbers filled in
writeFileSync(join(TMP, 'body.html'), body(pages));
print('body.html', join(TMP, 'body.pdf'));
print('cover.html', join(TMP, 'cover.pdf'));
execFileSync('pdfunite', [join(TMP, 'cover.pdf'), join(TMP, 'body.pdf'), OUT]);
const total = execFileSync('pdfinfo', [OUT]).toString().match(/Pages:\s+(\d+)/)[1];
rmSync(TMP, { recursive: true, force: true });
console.log(`Wrote ${OUT} (${total} pages). Chapter start pages:`, pages);
