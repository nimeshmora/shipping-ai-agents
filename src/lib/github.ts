// Stars and forks for the repo, read from the GitHub API once per build (not once per page,
// which would hit GitHub's limit of 60 calls an hour without a token).
import { REPO } from './site';

export const REPO_SLUG = REPO.replace('https://github.com/', '');
let cached: Promise<{ stars: number; forks: number } | null> | undefined;

export function repoStats() {
  cached ??= fetch(`https://api.github.com/repos/${REPO_SLUG}`, {
    signal: AbortSignal.timeout(5000),
    headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d ? { stars: d.stargazers_count as number, forks: d.forks_count as number } : null))
    .catch(() => null);
  return cached;
}
