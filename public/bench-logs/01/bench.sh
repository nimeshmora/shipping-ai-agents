#!/bin/bash
# bench.sh <quant> [num_gpu]    e.g.  ./bench.sh q4_K_M    or    ./bench.sh q4_K_M 0   (0 = CPU only)
M=llama3.1:8b-instruct-$1
O='"num_ctx":4096,"temperature":0,"seed":42,"num_predict":256'
[ -n "$2" ] && O="$O,\"num_gpu\":$2"
P='Explain what a GPU does when it runs a language model.'
for m in $(ollama ps | awk 'NR>1{print $1}'); do ollama stop $m; done
req() { curl -s localhost:11434/api/generate -d "{\"model\":\"$M\",\"prompt\":\"$1\",\"stream\":false,\"options\":{$O}}"; }
req hi > /dev/null
echo "== $M ${2:+num_gpu=$2}"
for i in 1 2 3; do
  req "$P" | jq -r '"run '$i': \(.eval_count) tokens, \(.eval_count/(.eval_duration/1e9)*10|round/10) tokens/s"'
done
ollama ps
nvidia-smi --query-gpu=memory.used,utilization.gpu --format=csv
