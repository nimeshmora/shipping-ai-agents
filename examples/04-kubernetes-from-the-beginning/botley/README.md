# Pretend Botley

The small app you run on Kubernetes in Notebook #4, *Kubernetes from the Beginning*.
It doesn't call a real model, so you need no API key and no cloud account.

```bash
docker build -t botley:1.0 .
docker run --rm -p 8080:8080 botley:1.0
curl "localhost:8080/plan?to=Lisbon"
```

The Kubernetes files for each chapter are in [`k8s/`](k8s/). The table that says which file goes with which chapter is in the [notebook's README](../README.md).
