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

    // Simpan nilai bersama waktu penerimaannya agar sumbu X dapat dibaca.
    historyArray.push({
        x: Date.now(),
        y: newValue
    });

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

function createChart(id, color, data, height, decimals, showAxes = true) {

    const options = {

        chart: {
            type: "area",
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
                enabled: false
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

        dataLabels: {
            enabled: false
        },

        markers: {
            size: showAxes ? 4 : 0,
            hover: {
                size: 6
            }
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
            enabled: true,
            x: {
                format: "HH:mm:ss"
            },
            y: {
                formatter: (value) => Number(value).toFixed(decimals)
            }
        },

        xaxis: {
            type: "datetime",
            labels: {
                show: showAxes,
                datetimeUTC: false,
                format: "HH:mm",
                style: {
                    fontSize: "10px"
                }
            },
            axisBorder: {
                show: showAxes
            },
            axisTicks: {
                show: showAxes
            }
        },

        yaxis: {
            show: showAxes,
            labels: {
                formatter: (value) => Number(value).toFixed(decimals),
                style: {
                    fontSize: "10px"
                }
            }
        },

        grid: {
            show: showAxes,
            borderColor: "rgba(19, 48, 91, 0.16)",
            strokeDashArray: 3,
            padding: {
                left: 4,
                right: 4
            }
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

    150,

    0

);

const eco2Chart = createChart(

    "#eco2Chart",

    "#F4A100",

    history.eco2,

    150,

    2

);

const temperatureChart = createChart(

    "#temperatureChart",

    "#3B82F6",

    history.temperature,

    110,

    1

);

const humidityChart = createChart(

    "#humidityChart",

    "#8B5CF6",

    history.humidity,

    110,

    0

);

