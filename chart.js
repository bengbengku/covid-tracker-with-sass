const buildChartData = (data) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if(lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data.cases[date] - lastDataPoint
      };
      chartData.push(newDataPoint);
    }
      lastDataPoint = data.cases[date];
  }

  return chartData;
};

const buildChart = (chartData) => {
    var timeFormat = "MM/DD/YY";
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
  
      // The data for our dataset
      data: {
        datasets: [
          {
            label: "🤢Total Kasus",
            backgroundColor: 'rgba(244, 144, 128, 0.8)',
            borderColor: "#cc1034",
            data: chartData,
          },
        ],
      },
  
      // Configuration options go here && Import moment.js
      options: {
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false,
        },
        elements: {
          point:{
              radius: 0
          }
        },  
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: timeFormat,
                tooltipFormat: "ll",
              },
              ticks: {
                padding: 20
              }
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                padding: 20,
                // Mengubah format dengan numeral
                callback: function (value, index, values) {
                  return numeral(value).format("0a");
                },
              },
            },
          ],
        },
      },
    });
  };

const buildPieChart = (data) => {
  var ctx = document.getElementById("myPieChart").getContext("2d");
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [data.active, data.recovered, data.deaths],
          backgroundColor: ["#9d80fe", "#7dd71d", "#fb4443"],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Kasus Aktif", "Sembuh", "Meninggal"],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};
