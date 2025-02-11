Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

const userId = document.getElementById(`userId`);
const userRole = document.getElementById(`role`);

if (userId) console.log(userId.value);
if (userRole) console.log(userRole.value);

const spaceQuote = document.getElementById(`spaceCiteQuoteStatus`);
if (spaceQuote) {
  (async function () {
    const result = await ExecuteFetch(`/api/graphic/?type=spaceCiteQuoteStatus&userId=${userId ? userId.value : ""}&role=${userRole ? userRole.value : ""}`);
    if (!result) return;
    PushPieGraphic({ data: result.data, element: spaceQuote, labels: result.label, type: `doughnut` });
  })()
}

const spaceQuoteYear = document.getElementById(`spaceCiteQuoteYear`);
if (spaceQuoteYear) {
  const yearSelect = document.getElementById(`yearSelect`);
  const changeGraphi = async (year) => {
    const result = await ExecuteFetch(`/api/graphic/?type=spaceCiteQuoteYear&year=${year ? year.value : ``}&userId=${userId ? userId.value : ``}&role=${userRole ? userRole.value : ""}`);
    console.log(result);
    if (!result) return;
    const max = Math.max.apply(null, result.data);
    PushBarGraphic({ data: result.data, element: spaceQuoteYear, labels: result.label, type: `bar`, max: max + 5 });
  };
  changeGraphi();
  // yearSelect.addEventListener(`change`, (e) => {
  //     // alert(e.target.value);
  //     spaceQuoteMonth.innerHTML = ``;
  //     changeGraphi(e.target.value)
  // });

}

const spaceQuoteMonth = document.getElementById(`spaceCiteQuoteMonth`);
if (spaceQuoteMonth) {
  const monthSelect = document.getElementById(`monthSelect`);
  const yearSelectMonth = document.getElementById(`yearSelectMonth`);
  const changeGraphi = async (month) => {
    const result = await ExecuteFetch(`/api/graphic/?type=spaceCiteQuoteMonth&month=${month ? month : ``}&year=${yearSelectMonth ? yearSelectMonth.value : ``}&userId=${userId ? userId.value : ``}&role=${userRole ? userRole.value : ""}`);
    if (!result) return;
    const max = Math.max.apply(null, result.data);
    PushBarGraphic({ data: result.data, element: spaceQuoteMonth, labels: result.label, type: `bar`, max: max + 5 });
  };
  changeGraphi();
  monthSelect.addEventListener(`change`, (e) => {
    // alert(e.target.value);
    spaceQuoteMonth.innerHTML = ``;
    changeGraphi(e.target.value)
  });
  yearSelectMonth.addEventListener(`change`, (e) => {
    // alert(e.target.value);
    spaceQuoteMonth.innerHTML = ``;
    changeGraphi(e.target.value)
  });
}

async function ExecuteFetch(url) {
  const result = await fetch(url);
  const json = await result.json();
  return json;
}

function PushPieGraphic({ element, type, labels, data }) {
  const optionsChart = {
    type,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#6A9AB0', '#CDC1FF', '#795757', `#7CF5FF`, `#4F75FF`, `#F5EFFF`, `#CDC1FF`, `#81DAE3`, `#6A9AB0`, `#FF204E`, `#98E4FF`, `#C70039`],
        hoverBackgroundColor: ['#3A6D8C', '#A594F9', '#664343', `#00CCDD`, `#6439FF`, `#F5EFFF`, `#A594F9`, `#6CBEC7`, `#3A6D8C`, `#A0153E`, `#80B3FF`, `#900C3F`],
        hoverBorderColor: "#f2f2f2",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  }
  new Chart(element, optionsChart);
}

function PushBarGraphic({ element, type, labels, data, max }) {
  const optionsChart = {
    type,
    data: {
      labels,
      datasets: [{
        label: "Citas totales ",
        backgroundColor: "#4e73df",
        hoverBackgroundColor: "#2e59d9",
        borderColor: "#4e73df",
        data,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 6
          },
          maxBarThickness: 25,
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: max,
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return value;
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + (tooltipItem.yLabel);
          }
        }
      },
    }
  }
  new Chart(element, optionsChart);
}

const allCarousel = document.querySelectorAll(`.carousel-item`);


