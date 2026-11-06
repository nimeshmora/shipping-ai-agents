# Notebook #4: Kubernetes from the Beginning

The code for [Kubernetes from the Beginning](https://nimeshmora.github.io/shipping-ai-agents/notebooks/kubernetes-from-the-beginning/).
You run Botley, a small pretend AI agent, on a Kubernetes cluster on your own laptop.

## What you need

- Docker, with at least 4 GB of memory for its virtual machine
- [kind](https://kind.sigs.k8s.io/) and kubectl

You don't need a cloud account or an API key.
The book was tested with the versions in [`versions.env`](versions.env): kind v0.33.0, which runs Kubernetes v1.37.0.

## Start here

```bash
git clone https://github.com/nimeshmora/shipping-ai-agents.git
cd shipping-ai-agents/examples/04-kubernetes-from-the-beginning/botley
docker build -t botley:1.0 .
```

Then follow Chapter 3. Every `kubectl apply -f k8s/...` in the book is run from this `botley` folder.

## Which files go with which chapter

All the Kubernetes files are in [`botley/k8s/`](botley/k8s/).

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

Chapters 1, 2 and 12 have no files of their own.

## Checking that everything still works

```bash
./test.sh
```

This makes a new three-node cluster called `botley-test` and runs Chapters 3 to 11 in order.
It builds both Botley images, applies each chapter's files, and checks that the result is what the chapter says.
For Chapter 10, it checks that each mystery still breaks in the way the chapter describes.
At the end it deletes the cluster. Use `./test.sh --keep` to leave it running.
