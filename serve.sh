#!/usr/bin/env bash
# Serve the site. Required — the lessons are fetched at runtime and browsers
# block fetch() on file://, so opening index.html directly shows no lesson text.
#
#   ./serve.sh          → http://localhost:8925
#   ./serve.sh 3000     → a different port
#   HOST=0.0.0.0 NO_OPEN=1 ./serve.sh 3000   → a hosted preview: every interface, no browser
#
# One host: localhost. Progress lives in localStorage, which is per origin, so 127.0.0.1:8925 would be a
# second, empty store. Open the URL this script prints (and opens), not the numeric one.
#
# Ctrl+C to stop.

set -euo pipefail
cd "$(dirname "$0")"

PORT="${1:-8925}"
HOST="${HOST:-127.0.0.1}"

python3 - "$PORT" "$HOST" <<'PY'
import http.server, os, socketserver, sys, threading, webbrowser

port = int(sys.argv[1])
host = sys.argv[2]

class Handler(http.server.SimpleHTTPRequestHandler):
    # no-store, so an edited app.js is never served from a stale cache
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()
    def log_message(self, *args):
        pass

socketserver.ThreadingTCPServer.allow_reuse_address = True
socketserver.ThreadingTCPServer.daemon_threads = True
try:
    httpd = socketserver.ThreadingTCPServer((host, port), Handler)
except OSError:
    sys.exit(f"  port {port} is busy — try ./serve.sh {port + 1}")

url = f"http://localhost:{port}"
print(f"  serving on {url}   (Ctrl+C to stop)")
if not os.environ.get("NO_OPEN"):
    threading.Timer(0.5, webbrowser.open, [url]).start()
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n  stopped")
finally:
    httpd.server_close()
PY
