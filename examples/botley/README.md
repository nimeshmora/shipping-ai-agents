# Pretend Botley

The small app you run on Kubernetes in Notebook #4, *Kubernetes from the Beginning*.
It doesn't call a real model, so you need no API key and no cloud account.

```bash
docker build -t botley:1.0 .
docker run --rm -p 8080:8080 botley:1.0
curl "localhost:8080/plan?to=Lisbon"
```

The YAML files for each chapter are in [`k8s/`](k8s/).

| Chapter | Files |
|---|---|
| 3. Pods | `pod.yaml` |
| 4. Who brings Botley back? | `deployment.yaml` |
| 5. Where did Botley go? | `service.yaml` |
| 6. Don't bake the key into the image | `configmap.yaml`, `deployment-with-settings.yaml` |
| 7. Shipping version 2 | `deployment-v2.yaml`, `deployment-v2-probes.yaml` |
| 8. Pending. Still pending. | `kind-three-nodes.yaml`, `deployment-resources.yaml` |
| 9. Letting users in | `gateway.yaml`, `httproute.yaml`, `botley-friendly.yaml`, `httproute-split.yaml` |
| 10. Who broke Botley? | `mysteries/mystery-1.yaml`, `mystery-2.yaml`, `mystery-3.yaml` (don't open them until you've solved them) |
| 11. More Botleys when it's busy | `hpa.yaml`, `deployment-autoscaled.yaml` |
