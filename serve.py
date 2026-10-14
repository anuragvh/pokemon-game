# Serves this folder at http://localhost:8417 with caching turned off,
# so the browser always loads the latest version of the game.
#   python3 serve.py
import http.server

PORT = 8417


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    print(f"Serving on http://localhost:{PORT}")
    http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler).serve_forever()
