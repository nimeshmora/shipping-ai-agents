#!/usr/bin/env python3
# bench2.py <num_ctx> [fill]    Loads llama3.1 8B (4-bit) with a context size and measures it.
# fill = send a prompt that fills about 80% of the context.
import json, subprocess, sys, time, urllib.request
M = 'llama3.1:8b-instruct-q4_K_M'
ctx = int(sys.argv[1]); fill = 'fill' in sys.argv[2:]
sh = lambda c: subprocess.run(c, shell=True, capture_output=True, text=True).stdout
for line in sh('ollama ps').splitlines()[1:]:
    sh('ollama stop ' + line.split()[0])
time.sleep(2)
def gen(prompt, n):
    body = {'model': M, 'prompt': prompt, 'stream': False,
            'options': {'num_ctx': ctx, 'temperature': 0, 'seed': 42, 'num_predict': n}}
    req = urllib.request.Request('http://localhost:11434/api/generate', json.dumps(body).encode(), {'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req, timeout=7200))
start = time.strftime('%Y-%m-%d %H:%M:%S')
gen('hi', 1)
print(f'== {M}  num_ctx={ctx}')
print(sh(f'sudo journalctl -u ollama --since "{start}" --no-pager | grep -oiE "Flash Attention [a-z]+|[KV] [(][a-z0-9_]+[)]: *[0-9.]+ MiB|KV buffer size *= *[0-9.]+ MiB|offloaded [0-9]+/[0-9]+ layers to GPU" | sort -u').strip())
print(sh('ollama ps | tail -n +2').strip())
print('GPU memory used:', sh('nvidia-smi --query-gpu=memory.used --format=csv,noheader').strip())
if fill:
    line = 'Line {}: the GPU reads every weight once for each new token.\n'
    text = ''.join(line.format(i) for i in range(int(ctx * 0.8 / 16)))
    prompts = [text + '\nCopy out the first 20 lines above, exactly as they are.']
else:
    prompts = ['Explain what a GPU does when it runs a language model.'] * 3
for i, p in enumerate(prompts, 1):
    r = gen(p, 128)
    pe = r['prompt_eval_count'] / (r['prompt_eval_duration'] / 1e9)
    ev = r['eval_count'] / (r['eval_duration'] / 1e9)
    print(f'run {i}: prompt {r["prompt_eval_count"]} tokens at {pe:.0f} tok/s, wrote {r["eval_count"]} tokens at {ev:.1f} tok/s')
