#!/usr/bin/env bash
# Runs Notebook #4 from Chapter 3 to Chapter 11 on a new kind cluster,
# and checks that each chapter's files still do what the chapter says.
#
#   ./test.sh            make a cluster called botley-test, run every check, delete the cluster
#   ./test.sh --keep     the same, but leave the cluster running so you can look around
#
# You need Docker, kind and kubectl. It takes about 10 minutes.
# Your own "botley" cluster from the book is not touched.

set -euo pipefail
cd "$(dirname "$0")"
source versions.env

CLUSTER=botley-test
KEEP=no
[[ "${1:-}" == "--keep" ]] && KEEP=yes

K="kubectl --context kind-$CLUSTER"
PF_PID=""

say()  { printf '\n\033[1m== %s\033[0m\n' "$*"; }
ok()   { printf '   ok: %s\n' "$*"; }
fail() { printf '\n\033[31mFAILED: %s\033[0m\n' "$*"; exit 1; }

# Try a command every 3 seconds until it works, or give up after $1 seconds.
retry() {
  local seconds=$1; shift
  local end=$((SECONDS + seconds))
  until "$@" >/dev/null 2>&1; do
    (( SECONDS >= end )) && return 1
    sleep 3
  done
}

port_forward() {  # port_forward <namespace> <target> <local:remote>
  stop_port_forward
  $K -n "$1" port-forward "$2" "$3" >/dev/null 2>&1 &
  PF_PID=$!
  retry 30 curl -s -o /dev/null "localhost:${3%%:*}/" -H "Host: botley.example.com" || true
}

stop_port_forward() {
  if [[ -n "$PF_PID" ]]; then kill "$PF_PID" 2>/dev/null || true; wait "$PF_PID" 2>/dev/null || true; PF_PID=""; fi
}

tester() { $K exec tester -- curl -s --max-time 5 "$@"; }

rollout() { $K rollout status deployment/"$1" --timeout=180s >/dev/null || fail "deployment/$1 did not finish rolling out"; }

cleanup() {
  stop_port_forward
  if [[ "$KEEP" == no ]]; then
    kind delete cluster --name "$CLUSTER" >/dev/null 2>&1 || true
  else
    echo; echo "The cluster is still running. Use it with: kubectl --context kind-$CLUSTER ..."
    echo "Delete it with: kind delete cluster --name $CLUSTER"
  fi
}
trap cleanup EXIT

say "Tools"
command -v docker >/dev/null || fail "docker is not installed"
command -v kind >/dev/null   || fail "kind is not installed"
command -v kubectl >/dev/null || fail "kubectl is not installed"
have_kind=$(kind version | awk '{print $2}')
[[ "$have_kind" == "$KIND_VERSION" ]] && ok "kind $have_kind" \
  || echo "   note: the book uses kind $KIND_VERSION and you have $have_kind. The checks may still pass."

say "A new cluster called $CLUSTER (three nodes, as in Chapter 8)"
kind delete cluster --name "$CLUSTER" >/dev/null 2>&1 || true
kind create cluster --name "$CLUSTER" --config botley/k8s/kind-three-nodes.yaml >/dev/null 2>&1
server=$($K version -o json 2>/dev/null | sed -n 's/.*"gitVersion": "\(v[0-9.]*\)".*/\1/p' | tail -1)
ok "Kubernetes $server (the book uses $KUBERNETES_VERSION)"

say "Chapter 3: build Botley and run one pod"
docker build -q -t botley:1.0 botley >/dev/null
docker build -q --build-arg VERSION=2.0 -t botley:2.0 botley >/dev/null
kind load docker-image botley:1.0 botley:2.0 --name "$CLUSTER" >/dev/null 2>&1
ok "images botley:1.0 and botley:2.0 are on the nodes"
$K apply -f botley/k8s/pod.yaml >/dev/null
$K wait pod/botley --for=condition=Ready --timeout=120s >/dev/null || fail "the pod did not become Ready"
port_forward default pod/botley 18080:8080
curl -s "localhost:18080/plan?to=Lisbon" | grep -q '"plan"' || fail "the pod did not answer /plan"
stop_port_forward
ok "the pod answers /plan?to=Lisbon"
$K delete pod botley --wait=true >/dev/null

say "Chapter 4: a Deployment brings Botley back"
$K apply -f botley/k8s/deployment.yaml >/dev/null
rollout botley
victim=$($K get pods -l app=botley -o name | head -1)
$K delete "$victim" --wait=false >/dev/null
retry 90 bash -c "[[ \$($K get deploy botley -o jsonpath='{.status.readyReplicas}') == 3 ]] && ! $K get $victim >/dev/null 2>&1" \
  || fail "the Deployment did not replace the deleted pod"
ok "a deleted pod was replaced, and 3 are ready"

say "Chapter 5: a Service finds the pods"
$K apply -f botley/k8s/service.yaml >/dev/null
$K run tester --image="$CURL_IMAGE" --restart=Never --command -- sleep 3600 >/dev/null
$K wait pod/tester --for=condition=Ready --timeout=120s >/dev/null || fail "the tester pod did not start"
retry 30 bash -c "$K exec tester -- curl -s --max-time 5 botley/ | grep -q '\"botley\"'" || fail "curl botley/ from the tester failed"
ok "the tester reaches Botley by the name botley"

say "Chapter 6: settings from a ConfigMap and a Secret"
$K apply -f botley/k8s/configmap.yaml >/dev/null
$K create secret generic botley-secrets --from-literal=MODEL_API_KEY=sk-pretend-1234 >/dev/null
$K apply -f botley/k8s/deployment-with-settings.yaml >/dev/null
rollout botley
tester botley/ | grep -q '"api_key_loaded": "yes"' || fail "Botley did not get MODEL_API_KEY"
tester "botley/plan?to=Oslo" | grep -q "Hello from Botley" || fail "Botley did not get GREETING"
ok "Botley has the key and the greeting"

say "Chapter 7: version 2, then version 2 with a readiness probe"
$K apply -f botley/k8s/deployment-v2.yaml >/dev/null
rollout botley
$K apply -f botley/k8s/deployment-v2-probes.yaml >/dev/null
rollout botley
tester botley/ | grep -q '"botley": "2.0"' || fail "Botley is not version 2.0"
ok "all pods run 2.0 and pass the probe"

say "Chapter 8: requests and limits"
$K apply -f botley/k8s/deployment-resources.yaml >/dev/null
rollout botley
cpu=$($K get deploy botley -o jsonpath='{.spec.template.spec.containers[0].resources.requests.cpu}')
[[ "$cpu" == 250m ]] || fail "expected a CPU request of 250m, got $cpu"
ok "3 Botleys run, each asking for 250m of CPU"

say "Chapter 9: the Gateway API with Envoy Gateway $ENVOY_GATEWAY_VERSION"
$K apply --server-side -f "https://github.com/envoyproxy/gateway/releases/download/$ENVOY_GATEWAY_VERSION/install.yaml" >/dev/null
$K -n envoy-gateway-system wait deployment/envoy-gateway --for=condition=Available --timeout=300s >/dev/null \
  || fail "Envoy Gateway did not start"
$K apply -f botley/k8s/gateway.yaml >/dev/null
$K apply -f botley/k8s/botley-friendly.yaml >/dev/null
$K apply -f botley/k8s/httproute.yaml >/dev/null
rollout botley-friendly
retry 180 bash -c "$K -n envoy-gateway-system get svc -l gateway.envoyproxy.io/owning-gateway-name=botley-gateway -o name | grep -q ." \
  || fail "no Envoy proxy Service appeared for botley-gateway"
envoy=$($K -n envoy-gateway-system get svc -l gateway.envoyproxy.io/owning-gateway-name=botley-gateway -o name | head -1)
$K -n envoy-gateway-system wait pod -l gateway.envoyproxy.io/owning-gateway-name=botley-gateway --for=condition=Ready --timeout=180s >/dev/null \
  || fail "the Envoy proxy pod did not become Ready"
port_forward envoy-gateway-system "$envoy" 18888:80
retry 60 bash -c "[[ \$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: botley.example.com' 'localhost:18888/plan?to=Lisbon') == 200 ]]" \
  || fail "the Gateway did not send botley.example.com to Botley"
ok "Host: botley.example.com gets a 200"
code=$(curl -s -o /dev/null -w '%{http_code}' "localhost:18888/plan?to=Lisbon")
[[ "$code" == 404 ]] || fail "a request with no matching hostname should get a 404, got $code"
ok "a name no route lists gets a 404"
$K apply -f botley/k8s/httproute-split.yaml >/dev/null
friendly=0
for _ in $(seq 1 30); do
  curl -s -H "Host: botley.example.com" "localhost:18888/plan?to=Lisbon" | grep -q "love to help" && friendly=$((friendly + 1))
  sleep 0.5
done
(( friendly >= 1 && friendly <= 15 )) || fail "the 90/10 split sent $friendly of 30 requests to botley-friendly"
ok "the 90/10 split sent $friendly of 30 requests to botley-friendly"
$K apply -f botley/k8s/httproute.yaml >/dev/null
stop_port_forward

say "Chapter 10: the three mysteries still break the way the chapter says"
$K apply -f botley/k8s/mysteries/mystery-1.yaml >/dev/null
retry 120 bash -c "$K get pods -l app=botley -o jsonpath='{.items[*].status.containerStatuses[*].state.waiting.reason}' | grep -q CrashLoopBackOff" \
  || fail "mystery 1 should end in CrashLoopBackOff"
$K logs -l app=botley --tail=50 2>/dev/null | grep -q "ValueError" || fail "mystery 1 logs should show a ValueError"
ok "mystery 1: CrashLoopBackOff with a ValueError in the logs"
$K apply -f botley/k8s/deployment-resources.yaml >/dev/null
rollout botley

$K apply -f botley/k8s/mysteries/mystery-2.yaml >/dev/null
retry 90 bash -c "$K events --types=Warning | grep -q 'Readiness probe failed: HTTP probe failed with statuscode: 404'" \
  || fail "mystery 2 should give 'Readiness probe failed ... 404' events"
ok "mystery 2: readiness probe fails with a 404"
$K apply -f botley/k8s/deployment-resources.yaml >/dev/null
rollout botley

$K apply -f botley/k8s/mysteries/mystery-3.yaml >/dev/null
retry 30 bash -c "[[ -z \$($K get endpointslices -l kubernetes.io/service-name=botley -o jsonpath='{.items[*].endpoints[*].addresses}') ]]" \
  || fail "mystery 3 should leave the Service with no endpoints"
ok "mystery 3: the Service has no endpoints"
$K apply -f botley/k8s/service.yaml >/dev/null
retry 30 bash -c "$K exec tester -- curl -s --max-time 5 botley/ | grep -q '\"botley\"'" || fail "Botley did not come back after fixing the Service"
ok "fixed again"

say "Chapter 11: metrics-server $METRICS_SERVER_VERSION and the autoscaler"
$K apply -f "https://github.com/kubernetes-sigs/metrics-server/releases/download/$METRICS_SERVER_VERSION/components.yaml" >/dev/null
$K patch -n kube-system deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]' >/dev/null
$K -n kube-system rollout status deployment/metrics-server --timeout=180s >/dev/null || fail "metrics-server did not start"
retry 180 $K top pods -l app=botley || fail "kubectl top pods did not work"
ok "kubectl top pods works"
$K apply -f botley/k8s/hpa.yaml >/dev/null
$K apply -f botley/k8s/deployment-autoscaled.yaml >/dev/null
retry 180 bash -c "$K get hpa botley -o jsonpath='{.status.currentMetrics[0].resource.current.averageUtilization}' | grep -q '[0-9]'" \
  || fail "the HPA never read Botley's CPU"
retry 120 bash -c "(( \$($K get deploy botley -o jsonpath='{.spec.replicas}') >= 2 ))" \
  || fail "the HPA should keep at least 2 Botleys"
ok "the HPA reads the CPU and keeps at least 2 Botleys"

say "All checks passed"
