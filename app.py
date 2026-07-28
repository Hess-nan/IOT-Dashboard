import os

from flask import Flask, render_template
from flask_socketio import SocketIO
from mqtt.mqtt_client import start_mqtt

app = Flask(__name__)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

# Jalankan MQTT
start_mqtt(socketio)

@socketio.on("connect")
def handle_connect():
    print("Browser Connected!")

@app.route("/")
def index():
    return render_template("index.html")

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
