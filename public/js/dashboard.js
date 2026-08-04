// ========================================
// SOCKET.IO
// ========================================

const SENSOR_TIMEOUT_MS = 15000;
let lastSensorUpdateAt = null;

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("id-ID");

}

function setConnectionStatus(status, color) {

    document.getElementById("connectionStatus").textContent = status;
    document.getElementById("connectionStatus").style.color = color;
    document.getElementById("liveIndicator").style.background = color;

}

function animateValue(elementId) {

    const element = document.getElementById(elementId);

    element.classList.remove("update-animation");
    void element.offsetWidth;
    element.classList.add("update-animation");

}

function updateDeviceInfo(data) {

    const details = ["ESP32 Connected"];

    if (data.firmware) {
        details.push(`Firmware ${data.firmware}`);
    }

    const wifi = Number(data.wifi);

    if (Number.isFinite(wifi)) {
        details.push(`WiFi RSSI: ${wifi} dBm`);
    }

    document.getElementById("deviceInfo").textContent = details.join(" · ");

}

function checkSensorStatus() {

    if (!socket || !socket.connected) {
        return;
    }

    if (
        lastSensorUpdateAt !== null &&
        Date.now() - lastSensorUpdateAt <= SENSOR_TIMEOUT_MS
    ) {
        setConnectionStatus("LIVE", "#2ecc71");
        return;
    }

    setConnectionStatus("WAITING SENSOR", "#f1c40f");

}

setInterval(updateClock, 1000);
setInterval(checkSensorStatus, 1000);
updateClock();

const realtimeEnabled = document.body.dataset.realtimeEnabled === "true";
const socket = realtimeEnabled ? io() : null;

setConnectionStatus(
    realtimeEnabled ? "WAITING SENSOR" : "REALTIME BACKEND REQUIRED",
    realtimeEnabled ? "#f1c40f" : "#e74c3c"
);

if (!realtimeEnabled) {
    document.body.classList.add("dashboard-ready");
}

if (socket) {
socket.on("connect", () => {

    console.log("WebSocket Connected");
    checkSensorStatus();
});

socket.on("disconnect", () => {

    console.log("WebSocket Disconnected");
    setConnectionStatus("OFFLINE", "#e74c3c");

});
}

// ========================================
// UPDATE WARNA TSP
// ========================================

function updateTspCard(status) {

    const card = document.querySelector(".tsp-card");

    card.classList.remove(
        "tsp-good",
        "tsp-medium",
        "tsp-unhealthy",
        "tsp-very-unhealthy",
        "tsp-hazardous"
    );

    switch (status) {
        case "Baik":
            card.classList.add("tsp-good");
            break;
        case "Sedang":
            card.classList.add("tsp-medium");
            break;
        case "T sehat":
        case "Tidak Sehat":
            card.classList.add("tsp-unhealthy");
            break;
        case "ST SEHAT":
        case "Sangat Tidak Sehat":
            card.classList.add("tsp-very-unhealthy");
            break;
        case "Bahaya":
        case "Berbahaya":
            card.classList.add("tsp-hazardous");
            break;
    }

}

// ========================================
// UPDATE WARNA ECO2
// ========================================

function updateEco2Card(status) {

    const card = document.querySelector(".eco2-card");

    card.classList.remove(
        "eco2-normal",
        "eco2-high",
        "eco2-danger",
        "eco2-error"
    );

    switch (status) {
        case "Normal":
            card.classList.add("eco2-normal");
            break;
        case "Tinggi":
            card.classList.add("eco2-high");
            break;
        case "S Tinggi":
        case "Bahaya":
            card.classList.add("eco2-danger");
            break;
        case "Error":
            card.classList.add("eco2-error");
            break;
    }

}


// ========================================
// DATA DARI MQTT
// ========================================

if (socket) {
socket.on("sensor_update", (data) => {

    console.log("Data MQTT diterima:", data);

    const tsp = Number(data.tsp);
    const eco2 = Number(data.ppmeCO2);
    const temperature = Number(data.temperature);
    const humidity = Number(data.humidity);

    if (![tsp, eco2, temperature, humidity].every(Number.isFinite)) {
        console.error("Format data MQTT tidak valid:", data);
        return;
    }

    document.getElementById("tsp").textContent = tsp;

    document.getElementById("ppmeCO2").textContent = eco2.toFixed(2);

    document.getElementById("temperature").textContent = temperature;

    document.getElementById("humidity").textContent = humidity;

    animateValue("tsp");
    animateValue("ppmeCO2");
    animateValue("temperature");
    animateValue("humidity");

    document.getElementById("statusIspu").textContent = data.statusIspuTsp;
    document.getElementById("statusEco2").textContent = data.eCO2Status;

    updateTspCard(data.statusIspuTsp);
    updateEco2Card(data.eCO2Status);

    updateRealtimeChart(tspChart, history.tsp, tsp);
    updateRealtimeChart(eco2Chart, history.eco2, eco2);
    updateRealtimeChart(temperatureChart, history.temperature, temperature);
    updateRealtimeChart(humidityChart, history.humidity, humidity);

    const now = new Date();
    lastSensorUpdateAt = now.getTime();

    document.getElementById("lastUpdate").innerHTML =
        "Last Update<br>" + now.toLocaleTimeString("id-ID");

    setConnectionStatus("LIVE", "#2ecc71");
    updateDeviceInfo(data);
    document.body.classList.add("dashboard-ready");

});
}
