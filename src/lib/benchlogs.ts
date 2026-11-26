// Bench Logs: write-ups of real runs on a real GPU, shown on the GPU Corner page (/engine-room/).
// Each log has its own page in src/pages/engine-room/logs/ and its files in public/bench-logs/<number>/.
// Add a new log at the top.
export type BenchLog = {
  number: number;
  slug: string;     // the page's file name in src/pages/engine-room/logs/, without .astro
  title: string;
  date: string;     // the day the run was done, for example "26 Nov 2026"
  finding: string;  // one plain sentence: what the run showed
  kit: string[];    // the GPU, the model and the tool, as short labels
};

export const benchLogs: BenchLog[] = [
  {
    number: 1,
    slug: 'will-it-fit',
    title: 'Will an 8B model fit on a 16 GB GPU?',
    date: '26 Nov 2026',
    finding: 'The 4-bit and 8-bit versions fit and ran fast. The 16-bit one did not fit, so 15% of it ran on the CPU and it got about 5 times slower.',
    kit: ['NVIDIA Tesla T4', 'Llama 3.1 8B', 'Ollama'],
  },
];
