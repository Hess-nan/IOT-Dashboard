import json
import os

import paho.mqtt.client as mqtt 

BROKER = os.getenv("MQTT_BROKER", "broker.emqx.io")
PORT = int(os.getenv("MQTT_PORT", "1883"))
TOPIC = os.getenv("MQTT_TOPIC", "ruangan/kualitas_udara")
USERNAME = os.getenv("MQTT_USERNAME")
PASSWORD = os.getenv("MQTT_PASSWORD")

def start_mqtt(socketio):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)

    if USERNAME and PASSWORD:
        client.username_pw_set(USERNAME, PASSWORD)

    def on_connect(client, userdata, flags, rc):
        print("MQTT Connected: ", rc)
        client.subscribe(TOPIC)

    def on_message(client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())

            print("MQTT diterima:", payload)

            socketio.emit(
                "sensor_update",
                payload
            )
            print("Dikirim ke browser: sensor_update")
        except Exception as e:
            print(e)

    client.on_connect = on_connect
    client.on_message = on_message
    client.connect_async(BROKER, PORT, 60)
    client.loop_start()
