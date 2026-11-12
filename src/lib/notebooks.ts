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
  // The notebook's folder in examples/, if it has example code. See examples/README.md.
  examples?: string;
  // The text on the button that links to that folder. Name the example app, like "Botley's code".
  // If it's not set, the button says "Get the code".
  examplesButton?: string;
  // The "Go deeper" box at the end of the notebook's last chapter, pointing to paid courses with labs.
  // Leave it out and no box is shown. The box always says the links are affiliate links.
  goDeeper?: {
    intro: string; // One or two sentences: what the reader could do next, and why a course helps
    courses: {
      name: string; // The course name, for example "Kubernetes for the Absolute Beginners"
      url: string; // Your affiliate link to that course
      for: string; // Who it's for, starting with "if" or "for", such as "If some chapters felt fast..."
      label: string; // A short note above the name, such as "Start here" or "Next step"
      tags: string[]; // Two or three short facts shown as pills, such as "Labs in your browser"
    }[];
  };
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
  {
    slug: 'kubernetes-from-the-beginning',
    number: 4,
    title: 'Kubernetes from the Beginning',
    blurb: 'You run Botley on a Kubernetes cluster on your own laptop, one piece at a time: pods, Deployments, Services, Secrets, updates, resources, the Gateway API, debugging and autoscaling. No cloud account needed.',
    cover: 'kb-cover',
    examples: '04-kubernetes-from-the-beginning',
    examplesButton: "Botley's code",
    goDeeper: {
      intro: "You've run Botley on a cluster and broken it many times. The best way to make it stick is more practice on clusters you didn't build yourself.",
      courses: [
        {
          name: 'Kubernetes for the Absolute Beginners',
          url: 'https://tidd.ly/4iTrLI8',
          for: 'If some chapters felt fast. It goes over pods, Deployments and Services again, with a lab after each lesson.',
          label: 'Start here',
          tags: ['Labs in your browser', 'Beginner'],
        },
        {
          name: 'Certified Kubernetes Administrator (CKA)',
          url: 'https://tidd.ly/4AspniK',
          for: 'For when you want the certificate. It covers looking after the cluster itself, such as upgrades, backups and fixing broken nodes.',
          label: 'Next step: the certificate',
          tags: ['Labs in your browser', 'Mock exams'],
        },
      ],
    },
    edition: 'First edition, November 2026',
  },
];

export function notebook(slug: string): Notebook {
  const n = notebooks.find((x) => x.slug === slug);
  if (!n) throw new Error(`Unknown notebook: ${slug}. Add it to src/lib/notebooks.ts.`);
  return n;
}
