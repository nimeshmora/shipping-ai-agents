#!/usr/bin/env python3
# bench3.py <users> <app> [requests_per_user]
# <users> people chat at the same time. Users are spread evenly over the ready pods with label app=<app>.
# Every answer is exactly 256 tokens (ignore_eos) at temperature 0, so every run does the same work.
import json, subprocess, sys, threading, time, urllib.request
users = int(sys.argv[1]); app = sys.argv[2]; per = int(sys.argv[3]) if len(sys.argv) > 3 else 4
N = 256
ips = subprocess.run(['kubectl', 'get', 'pods', '-l', 'app=' + app, '-o',
      'jsonpath={range .items[?(@.status.containerStatuses[0].ready==true)]}{.status.podIP} {end}'],
      capture_output=True, text=True).stdout.split()
res = []; lock = threading.Lock()
def ask(ip, prompt, n, stream=True):
    body = {'model': 'Qwen/Qwen3-0.6B', 'prompt': prompt, 'max_tokens': n, 'temperature': 0,
            'ignore_eos': True, 'stream': stream, 'stream_options': {'include_usage': True}} if stream else \
           {'model': 'Qwen/Qwen3-0.6B', 'prompt': prompt, 'max_tokens': n}
    req = urllib.request.Request(f'http://{ip}:8000/v1/completions', json.dumps(body).encode(),
                                 {'Content-Type': 'application/json'})
    t0 = time.time(); first = None; toks = 0
    with urllib.request.urlopen(req, timeout=900) as r:
        for line in r:
            line = line.decode().strip()
            if not stream or not line.startswith('data:') or line.endswith('[DONE]'): continue
            d = json.loads(line[5:])
            if first is None and d.get('choices') and d['choices'][0].get('text'): first = time.time() - t0
            if d.get('usage'): toks = d['usage']['completion_tokens']
    return first, time.time() - t0, toks
def user(u):
    for i in range(per):
        r = ask(ips[u % len(ips)], f'User {u}, request {i}. Explain how a GPU runs many threads at once.', N)
        with lock: res.append(r)
for ip in ips: ask(ip, 'warm up', 8, stream=False)
start = time.time()
th = [threading.Thread(target=user, args=(u,)) for u in range(users)]
[t.start() for t in th]; [t.join() for t in th]
wall = time.time() - start
tot = sum(r[2] for r in res)
speed = sorted((r[2] - 1) / (r[1] - r[0]) for r in res)
ttft = sorted(r[0] for r in res)
med = lambda a: a[len(a) // 2]
print(f'pods={len(ips)} users={users} requests={len(res)} tokens={tot} wall={wall:.1f}s')
print(f'  whole GPU : {tot / wall:.1f} tokens/s')
print(f'  each user : {med(speed):.1f} tokens/s (median)')
print(f'  first word: {med(ttft) * 1000:.0f} ms median, {ttft[-1] * 1000:.0f} ms worst')
print('  GPU memory used:', subprocess.run(['nvidia-smi', '--query-gpu=memory.used', '--format=csv,noheader'],
      capture_output=True, text=True).stdout.strip())
