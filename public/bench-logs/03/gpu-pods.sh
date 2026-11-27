#!/bin/bash
# gpu-pods.sh <name> <pods> [gpu-memory-utilization]
# Runs <pods> copies of vLLM serving Qwen3-0.6B. Each pod asks Kubernetes for 1 nvidia.com/gpu.
# Leave out the last number to use vLLM's own default (0.92 of the GPU memory in v0.31.0, seen in its error message).
NAME=$1; N=$2; UTIL=$3
EXTRA=""; [ -n "$UTIL" ] && EXTRA="        - --gpu-memory-utilization=$UTIL"
kubectl apply -f - <<YAML
apiVersion: apps/v1
kind: Deployment
metadata: {name: $NAME}
spec:
  replicas: $N
  selector: {matchLabels: {app: $NAME}}
  template:
    metadata: {labels: {app: $NAME}}
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:v0.31.0
        imagePullPolicy: IfNotPresent
        args:
        - Qwen/Qwen3-0.6B
        - --dtype=half
        - --max-model-len=4096
        - --enforce-eager
$EXTRA
        env: [{name: HF_HUB_OFFLINE, value: "1"}]
        resources:
          requests: {cpu: 500m, memory: 3Gi, nvidia.com/gpu: 1}
          limits: {cpu: "2", memory: 6Gi, nvidia.com/gpu: 1}
        readinessProbe: {httpGet: {path: /health, port: 8000}, periodSeconds: 5}
        volumeMounts:
        - {name: hf, mountPath: /root/.cache/huggingface}
        - {name: shm, mountPath: /dev/shm}
      volumes:
      - {name: hf, hostPath: {path: /var/lib/kk-hf, type: Directory}}
      - {name: shm, emptyDir: {medium: Memory, sizeLimit: 2Gi}}
YAML
