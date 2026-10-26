// Every notebook on the site, in order. Add a new entry here to show it on the front page and give it a sidebar.
// Its chapters go in src/content/notebooks/<slug>/, and its cover, "how to use" and word list pages
// go in src/pages/notebooks/<slug>/ (index.astro, how.astro and back.mdx).
export type Notebook = {
  slug: string;
  number: number;
  title: string;
  blurb: string;
  pdf?: string;
  cover: string;
  edition: string;
};

export const notebooks: Notebook[] = [
  {
    slug: 'shipping-ai-agents',
    number: 1,
    title: 'Shipping AI Agents',
    blurb: 'Taking an AI agent from a prototype to production on AWS, Microsoft Azure and Google Cloud. Covers hosting options, security, sessions, memory, cost and a full deployment walkthrough.',
    pdf: 'shipping-ai-agents.pdf',
    cover: 'cover-scene',
    edition: 'First edition, October 2026',
  },
  {
    slug: 'running-your-own-models',
    number: 2,
    title: 'Running Your Own Models',
    blurb: 'Managed model services or your own GPUs? How models use GPU memory, what Bedrock, Agent Platform and Foundry offer, how to serve an open model with vLLM on Kubernetes, and when running your own actually pays off.',
    pdf: 'running-your-own-models.pdf',
    cover: 'rm-cover',
    edition: 'First edition, October 2026',
  },
  {
    slug: 'inside-the-machine',
    number: 3,
    title: 'Inside the Machine',
    blurb: 'How GPUs run your agent. Starts from zero: what a computer is, how CPUs, memory and GPUs work, why memory speed sets the pace, and what happens inside the data centers where agents run.',
    pdf: 'inside-the-machine.pdf',
    cover: 'im-cover',
    edition: 'First edition, October 2026',
  },
];

export function notebook(slug: string): Notebook {
  const n = notebooks.find((x) => x.slug === slug);
  if (!n) throw new Error(`Unknown notebook: ${slug}. Add it to src/lib/notebooks.ts.`);
  return n;
}
