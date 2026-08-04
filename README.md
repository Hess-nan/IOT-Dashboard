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
  "ppmEco2": 1200,
  "eco2Status": "Tinggi",
  "firmware": "2.4.1",
  "wifi": -63
}
```

Format lama `ppmeCO2` dan `eCO2Status` juga tetap didukung.

## Deploy Vercel

Proyek ini sudah menggunakan entry point Flask yang dideteksi Vercel (`app.py`),
sehingga tidak memerlukan `vercel.json` atau Build Command khusus.

1. Push folder ini ke GitHub, lalu **Add New → Project** di Vercel dan pilih repositorinya.
2. Biarkan Framework Preset dan Build Command pada nilai default, lalu deploy.
3. Tambahkan variabel lingkungan MQTT di **Settings → Environment Variables** bila
   aplikasi juga dijalankan pada server realtime terpisah.

File statis sekarang berada di `public/`, agar disajikan dari CDN Vercel.

### Batasan realtime

Dashboard Flask dapat dideploy di Vercel, tetapi bridge MQTT dan Socket.IO pada
proyek ini membutuhkan proses yang terus hidup. Karena itu bridge tersebut hanya
aktif saat dijalankan lokal atau di server persisten; pada Vercel dashboard akan
menampilkan `REALTIME BACKEND REQUIRED` dan tidak mencoba membuka Socket.IO.

Untuk data realtime di production, jalankan `app.py` ini pada layanan server
persisten (misalnya Render/Railway/Fly.io/VPS) sebagai bridge MQTT, atau ubah
frontend untuk berlangganan MQTT over WebSocket langsung ke broker. Vercel tetap
cocok untuk menyajikan frontend/dashboard.

## Environment variables opsional

| Variable | Default |
| --- | --- |
| `MQTT_BROKER` | `broker.emqx.io` |
| `MQTT_PORT` | `1883` |
| `MQTT_TOPIC` | `ruangan/kualitas_udara` |
| `MQTT_USERNAME` | kosong |
| `MQTT_PASSWORD` | kosong |
