import json
import os

import paho.mqtt.client as mqtt 

BROKER = os.getenv("MQTT_BROKER", "broker.emqx.io")
PORT = int(os.getenv("MQTT_PORT", "1883"))
TOPIC = os.getenv("MQTT_TOPIC", "ruangan/kualitas_udara")
USERNAME = os.getenv("MQTT_USERNAME")
PASSWORD = os.getenv("MQTT_PASSWORD")

def normalize_payload(payload):
    """Accept the field names used by both firmware payload formats."""
    payload["ppmeCO2"] = payload.get("ppmeCO2", payload.get("ppmEco2"))
    payload["eCO2Status"] = payload.get("eCO2Status", payload.get("eco2Status"))
    return payload

def start_mqtt(socketio):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)

    if USERNAME and PASSWORD:
        client.username_pw_set(USERNAME, PASSWORD)

    def on_connect(client, userdata, flags, rc):
        print("MQTT Connected: ", rc)
        client.subscribe(TOPIC)
        print("MQTT subscribed to:", TOPIC)

    def on_connect_fail(client, userdata):
        print(
            "MQTT connection failed. Check MQTT_BROKER, MQTT_PORT, "
            "and whether the broker accepts connections from Railway."
        )

    def on_disconnect(client, userdata, rc):
        print("MQTT disconnected, code:", rc)

    def on_message(client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            payload = normalize_payload(payload)

            print("MQTT diterima:", payload)

            socketio.emit(
                "sensor_update",
                payload
            )
            print("Dikirim ke browser: sensor_update")
        except Exception as e:
            print(e)

    client.on_connect = on_connect
    client.on_connect_fail = on_connect_fail
    client.on_disconnect = on_disconnect
    client.on_message = on_message
    print("MQTT connecting to {}:{} (topic: {})".format(BROKER, PORT, TOPIC))
    client.connect_async(BROKER, PORT, 60)
    client.loop_start()
