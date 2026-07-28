# IoT Air Quality Dashboard

Dashboard realtime untuk memantau data kualitas udara dari MQTT menggunakan Flask, Flask-SocketIO, dan ApexCharts.

## Jalankan lokal

```bash
pip install -r requirements.txt
python app.py
```

Buka `http://127.0.0.1:5000`.

## Payload MQTT

```json
{
  "temperature": 30,
  "humidity": 65,
  "tsp": 70,
  "statusIspuTsp": "T sehat",
  "ppmeCO2": 1200,
  "eCO2Status": "Tinggi",
  "firmware": "2.4.1",
  "wifi": -63
}
```

## Deploy Render

File `render.yaml` sudah disertakan. Saat membuat service dari dashboard Render, gunakan:

- **Type:** Web Service
- **Runtime:** Python
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn -w 1 --threads 100 --bind 0.0.0.0:$PORT app:app`
- **Health Check Path:** `/health`

## Environment variables opsional

| Variable | Default |
| --- | --- |
| `MQTT_BROKER` | `broker.emqx.io` |
| `MQTT_PORT` | `1883` |
| `MQTT_TOPIC` | `ruangan/kualitas_udara` |
| `MQTT_USERNAME` | kosong |
| `MQTT_PASSWORD` | kosong |
