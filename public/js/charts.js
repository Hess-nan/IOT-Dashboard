// ======================================================
// DATA HISTORY REALTIME
// ======================================================

const history = {

    tsp: [],

    eco2: [],

    temperature: [],

    humidity: []

};

// ======================================================
// UPDATE CHART REALTIME
// ======================================================

function updateRealtimeChart(chart, historyArray, newValue) {

    // Tambah data baru
    historyArray.push(newValue);

    // Simpan maksimal 20 data
    if (historyArray.length > 20) {
        historyArray.shift();
    }

    // Update chart
    chart.updateSeries([{
        data: historyArray
    }]);

}

// ======================================================
// MEMBUAT CHART
// ======================================================

function createChart(id, color, data, height) {

    const options = {

        chart: {
            type: "line",
            height: height,
            width: "100%",

            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 350,
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },

            sparkline: {
                enabled: true
            },

            toolbar: {
                show: false
            }
        },

        series: [{
            data: data
        }],

        stroke: {
            curve: "smooth",
            width: 3
        },

        colors: [color],

        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.35,
                opacityTo: 0
            }
        },

        tooltip: {
            enabled: true
        }

    };

    const chart = new ApexCharts(
        document.querySelector(id),
        options
    );

    chart.render();

    return chart;
}

// ======================================================
// MEMBUAT SEMUA CHART
// ======================================================

const tspChart = createChart(

    "#tspChart",

    "#18B979",

    history.tsp,

    150

);

const eco2Chart = createChart(

    "#eco2Chart",

    "#F4A100",

    history.eco2,

    150

);

const temperatureChart = createChart(

    "#temperatureChart",

    "#3B82F6",

    history.temperature,

    60

);

const humidityChart = createChart(

    "#humidityChart",

    "#8B5CF6",

    history.humidity,

    60

);

