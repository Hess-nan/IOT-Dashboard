import os

from flask import Flask, render_template
from flask_socketio import SocketIO
from mqtt.mqtt_client import start_mqtt

# Vercel serves files in ./public directly from its CDN.  Using the same folder
# locally keeps the URLs identical in both environments.
app = Flask(__name__, static_folder="public", static_url_path="")

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

# Vercel Functions are short-lived and must not run a persistent MQTT client.
# Keep the MQTT + Socket.IO bridge for local/self-hosted deployments only.
IS_VERCEL = os.getenv("VERCEL") == "1"

if not IS_VERCEL:
    start_mqtt(socketio)

@socketio.on("connect")
def handle_connect():
    print("Browser Connected!")

@app.route("/")
def index():
    return render_template("index.html", realtime_enabled=not IS_VERCEL)

@app.route("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=True,
        use_reloader=False,
        allow_unsafe_werkzeug=True
    )
