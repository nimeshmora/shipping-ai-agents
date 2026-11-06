# A pretend Botley for Notebook #4 (Kubernetes from the Beginning).
#
# It doesn't call a real model, so you don't need an API key or a cloud account.
# It answers trip questions with a fixed reply, and it has a few extra pages that
# let you break it on purpose and watch what Kubernetes does.
#
#   GET /                 who am I? (version and pod name)
#   GET /plan?to=Lisbon   a pretend trip plan
#   GET /health           "ok" once Botley has finished starting
#                         (every page answers 503 "still starting" until then)
#   GET /crash            Botley quits straight away
#   GET /eat?mb=300       Botley grabs this much memory and keeps it
#
# Settings it reads from environment variables:
#   GREETING        the first words of every trip plan (Chapter 6)
#   MODEL_API_KEY   pretend API key; Botley only says whether it has one (Chapter 6)
#   STARTUP_SECONDS how long Botley takes to "load" before /health says ok (Chapter 7)

import json
import os
import signal
import socket
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

VERSION = os.environ.get("BOTLEY_VERSION", "1.0")
GREETING = os.environ.get("GREETING", "Here is a plan")
STARTUP_SECONDS = float(os.environ.get("STARTUP_SECONDS", "0"))
STARTED = time.time()
eaten = []  # memory grabbed by /eat stays here so it isn't freed


def has_api_key():
    return "yes" if os.environ.get("MODEL_API_KEY") else "no"


class Botley(BaseHTTPRequestHandler):
    def reply(self, status, body):
        data = json.dumps(body, indent=2).encode() + b"\n"
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        url = urlparse(self.path)
        query = parse_qs(url.query)
        starting = time.time() - STARTED < STARTUP_SECONDS

        if starting and url.path != "/crash":
            # Like a real agent loading its tools and memory: not ready to answer yet.
            self.reply(503, {"status": "still starting", "pod": socket.gethostname()})

        elif url.path == "/":
            self.reply(200, {"botley": VERSION, "pod": socket.gethostname(), "api_key_loaded": has_api_key()})

        elif url.path == "/plan":
            to = query.get("to", ["somewhere sunny"])[0]
            self.reply(200, {"botley": VERSION, "pod": socket.gethostname(),
                             "plan": f"{GREETING}: fly to {to} on Tuesday, stay three nights, eat well."})

        elif url.path == "/health":
            self.reply(200, {"status": "ok"})

        elif url.path == "/crash":
            print("Someone asked me to crash. Goodbye!", flush=True)
            self.reply(200, {"status": "crashing"})
            os._exit(1)

        elif url.path == "/eat":
            mb = int(query.get("mb", ["100"])[0])
            for _ in range(mb):
                eaten.append(bytearray(1024 * 1024))
            print(f"Ate {mb} MB. Total eaten: {len(eaten)} MB", flush=True)
            self.reply(200, {"eaten_mb": len(eaten)})

        else:
            self.reply(404, {"error": "no such page"})

    def log_message(self, fmt, *args):
        # One short line per request, printed to the container log.
        print(f"{self.command} {self.path} -> {args[1] if len(args) > 1 else ''}", flush=True)


def stop(signum, frame):
    # Kubernetes sends SIGTERM when it wants a pod to stop (Chapter 7).
    print("Kubernetes asked me to stop. Goodbye!", flush=True)
    sys.exit(0)


if __name__ == "__main__":
    signal.signal(signal.SIGTERM, stop)
    print(f"Botley {VERSION} starting on port 8080 (pod {socket.gethostname()})", flush=True)
    ThreadingHTTPServer(("", 8080), Botley).serve_forever()
