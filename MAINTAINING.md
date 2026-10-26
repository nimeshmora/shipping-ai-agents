# Maintaining the site

Notes for the owner of the repository. Contributors don't need any of this.

## Publishing

The site is hosted on GitHub Pages at https://nimeshmora.github.io/shipping-ai-agents/.
Every push to `main` builds and publishes it with `.github/workflows/deploy.yml`.

One-time setup: in **Settings > Pages > Build and deployment**, set **Source** to **GitHub Actions**.
The address is set by `site` and `base` in `astro.config.mjs`.

### Using your own domain

Add a file called `public/CNAME` that contains only your domain (for example `agents.example.com`),
set `site` to `https://agents.example.com` and `base` to `'/'` in `astro.config.mjs`,
then add the domain under **Settings > Pages > Custom domain** and follow GitHub's DNS steps.

## The front page

The site front page is **Ship It with Nimesha** (`src/pages/index.astro`). It lists every notebook in `src/lib/notebooks.ts`;
the dashed "Notebook #2, in the works" card always appears after the last one. The picture next to the speech bubble is `src/sketches/chars/nimesha.svg`, a copy of the logo.
If you change `public/favicon.svg`, update it too (it is the same drawing wrapped in `translate(14,10)`).

Every notebook lives at `/notebooks/<notebook>/`, with chapters at `/notebooks/<notebook>/<chapter>/`.
Notebook #1's older addresses (`/chapters/…`, `/how/`, `/back/`) redirect to the new ones; the list is in `astro.config.mjs`.

## Adding a notebook

1. Add an entry to `src/lib/notebooks.ts` (slug, number, title, blurb, cover sketch, edition, and `pdf` if there is one).
2. Put its chapters in `src/content/notebooks/<slug>/`.
3. Add `index.astro` (cover), `how.astro` and `back.mdx` in `src/pages/notebooks/<slug>/`. Copy Notebook #1's and change the `notebook` prop.

## Talks board

The “Where I share this in person” board on the front page (the right-hand column on wide screens) reads `src/lib/talks.ts`. Add a new talk at the top of the list,
set `upcoming: false` (or remove it) once it has happened, and update `pastTalks.count` as the number grows.
A talk without a `date` shows “Date coming soon”.

## The logo

The logo is Botley sailing out on a paper-style boat. It lives in `public/favicon.svg` and is used both as the browser tab icon
and in the top bar, so editing that one file changes both.

## Making a notebook's PDF

```bash
npm run pdf -- running-your-own-models
```

This builds the site, prints the notebook to A4 with Google Chrome, fills in the page numbers in the contents table,
and writes `public/<notebook>.pdf`. It needs Google Chrome 131 or newer and Poppler (`brew install poppler`).
Run it again after you change a notebook, then commit the new PDF. Notebook #1's PDF was made earlier, by hand.

## Visitor counts

The site uses [GoatCounter](https://www.goatcounter.com): free, no cookies, and no cookie banner needed.
The code is set in `src/lib/site.ts` (`GOATCOUNTER`). Counting only runs on the live site.

Besides page views, a **"Finished: …"** event is counted the first time a reader scrolls to the end of a page,
so you can compare how many people open a chapter with how many read it to the end.

### Public visit counter

The front page shows “👀 N visits so far” using GoatCounter's public counter
(`https://<code>.goatcounter.com/counter/TOTAL.json`). It only appears when GoatCounter allows it:
in GoatCounter, open **Settings** and turn on **Allow adding visitor counts on your website**, then save.
While that is off, or if a visitor's ad blocker blocks GoatCounter, the counter simply stays hidden.

## Protected main branch

`main` has a ruleset called **Protect main** (Settings > Rules > Rulesets):

- Nobody can push to `main` directly. Every change goes through a pull request, including yours.
- A pull request can only be merged when the **build** check passes (`.github/workflows/check.yml`).
- Force-pushes to `main` and deleting `main` are blocked.
- No approval is required, because GitHub does not let you approve your own pull request.

To make a change yourself:

```bash
git checkout -b my-change
# edit, then
git commit -am "Describe the change"
git push -u origin my-change
gh pr create --fill        # or open the pull request on GitHub
gh pr merge --squash       # after the build check passes
```

The first time someone contributes, GitHub waits for you to approve running their checks.
Open the pull request and click **Approve and run workflows**.

## Reviewing contributions

- Issue forms are in `.github/ISSUE_TEMPLATE/` and tag issues `fix`, `example`, `topic idea` or `speaking`. Speaking offers come from the “Raise your hand to speak” form.
- Every pull request runs `.github/workflows/check.yml`, which makes sure the site still builds.
- Check that new facts link to official documentation and that `lastChecked` was updated.

## Keeping it accurate

Re-check the facts and the commands in chapter 12 every few months, then update each chapter's `lastChecked` date.
