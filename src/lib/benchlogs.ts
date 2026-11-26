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
  // The headline numbers, shown as bars on the GPU Corner page. pct is the bar length (100 = the best result).
  // tone: '' for normal, 'warn' for a result that went wrong (did not fit), 'cpu' for a CPU-only baseline.
  stats: { label: string; value: string; pct: number; tone: '' | 'warn' | 'cpu' }[];
  statsNote: string; // one line under the bars: what they measure
};

export const benchLogs: BenchLog[] = [
  {
    number: 2,
    slug: 'long-context',
    title: 'How long can a chat get on a 16 GB GPU?',
    date: '26 Nov 2026',
    finding: 'Every token of context took 128 KiB of GPU memory. At 128K it no longer fit and speed fell to 6.9 tokens a second. An 8-bit cache got 32 of 33 layers back on the GPU (31 tokens a second). A really long prompt slows every new token.',
    kit: ['NVIDIA Tesla T4', 'Llama 3.1 8B (4-bit)', 'Ollama'],
    stats: [
      { label: '4K to 64K context', value: '42 tok/s', pct: 100, tone: '' },
      { label: '128K, 8-bit cache', value: '31 tok/s', pct: 74, tone: '' },
      { label: '128K, 16-bit cache (did not fit)', value: '6.9 tok/s', pct: 16, tone: 'warn' },
      { label: '64K, prompt filled', value: '20.5 tok/s', pct: 49, tone: 'cpu' },
    ],
    statsNote: 'Tokens per second, Llama 3.1 8B (4-bit) on an NVIDIA T4 (15 GiB). Short prompt unless it says filled.',
  },
  {
    number: 1,
    slug: 'will-it-fit',
    title: 'Will an 8B model fit on a 16 GB GPU?',
    date: '26 Nov 2026',
    finding: 'The 4-bit and 8-bit versions fit and ran fast. The 16-bit one did not fit, so 15% of it ran on the CPU and it got about 5 times slower.',
    kit: ['NVIDIA Tesla T4', 'Llama 3.1 8B', 'Ollama'],
    stats: [
      { label: '4-bit', value: '41 tok/s', pct: 100, tone: '' },
      { label: '8-bit', value: '30 tok/s', pct: 73, tone: '' },
      { label: '16-bit (did not fit)', value: '8.6 tok/s', pct: 21, tone: 'warn' },
      { label: 'CPU only', value: '3 tok/s', pct: 7, tone: 'cpu' },
    ],
    statsNote: 'Tokens per second, Llama 3.1 8B on an NVIDIA T4 (15 GiB).',
  },
];
