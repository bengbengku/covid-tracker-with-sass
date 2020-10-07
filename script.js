"use strict";

window.onload = () => {
  initMap();
  getCountriesData();
  getHistoricalData();
  getWorldCoronaData();
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
const worldWideSelection = {
  name: 'Seluruh Dunia',
  value: 'www',
  selected: true
}
var casesTypeColors = {
  cases: "#cc1034",
  active: "#9d80fe",
  recovered: "#7dd71d",
  deaths: "#fb4443",
};

const mapCenter = {
  lat: -5,
  lng: 120
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 3.2,
    minZoom: 3,
    styles: mapStyle, //var dari mapStyle.js
    scrollwheel: false,
  });

  infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (elem, casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);
  setActiveTab(elem);
};

const setActiveTab = (elem) => {
  const activeEl = document.querySelector('.card.active');
  activeEl.classList.remove('active');
  elem.classList.add("active");
}


const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};

const setMapCenter = (lat, long, zoom) => {
  map.panTo({
    lat: lat,
    lng: long,
  })
  map.setZoom(zoom);
}


const initDropdown = (searchList) => {
  $(".ui.dropdown").dropdown({
      values: searchList,
      onChange: function(value, text){
        if(value !== worldWideSelection.value) {
          getCountryData(value);
        } else {
          getWorldCoronaData();
        }
      }
    }); //load semantic
}

const setSearchList = (data) => {
  let searchList = [];
  searchList.push(worldWideSelection);
  data.forEach((countryData) => {
      searchList.push({
        name: countryData.country,
        value: countryData.countryInfo.iso3,
      })
      initDropdown(searchList);
  })
}


const getCountriesData = () => {
  //Mengambil data dari api #1

  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
      setSearchList(data);
      showDataOnMap(data); // passing data
      showDataInTable(data);
    });
};

const getCountryData = (countryIso) => {
  const url = "https:/disease.sh/v3/covid-19/countries/" + countryIso;
  
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMapCenter(data.countryInfo.lat, data.countryInfo.long, 2); // Passing dari setMapCenter
      setStatsData(data);
    });
}

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setStatsData(data);
      setMapCenter(mapCenter.lat, mapCenter.lng, 3); // Passing dari setMapCenter
    });
};

const setStatsData = (data) => {
  let addedCases = numeral(data.todayCases).format("+0,0");
  let addedRecovered = numeral(data.todayRecovered).format("+0,0");
  let addedDeaths = numeral(data.todayDeaths).format("+0,0");
  let totalCases = numeral(data.cases).format("0.0a");
  let totalRecovered = numeral(data.recovered).format("0.0a");
  let totalDeaths = numeral(data.deaths).format("0.0a");

  document.querySelector(".total-number").innerHTML = addedCases;
  document.querySelector(".recovered-number").innerHTML = addedRecovered;
  document.querySelector(".deaths-number").innerHTML = addedDeaths;

  document.querySelector(".cases-total").innerHTML = `${totalCases} Total`;
  document.querySelector(
    ".recovered-total"
  ).innerHTML = `${totalRecovered} Total`;
  document.querySelector(".deaths-total").innerHTML = `${totalDeaths} Total`;
};

const getHistoricalData = () => {
  //Mengambil data historical dari api

  fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

const showDataOnMap = (data, casesType = "cases") => {
  //Mengeluarkan data untuk ditampilkan #2
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType] * 0.28,
    });

    mapCircles.push(countryCircle); //Menyimpan data countryCircle ke array mapCircles

    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${
                  country.countryInfo.flag
                })"></div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total Kasus: ${numeral(country.cases).format("0,0")}
                </div>
                <div class="info-deaths">
                   Meninggal: ${numeral(country.deaths).format("0,0")} 
                </div>
                <div class="info-recovered">
                   Sembuh: ${numeral(country.recovered).format("0,0")}        
                </div>                
            </div>
          `;
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });

    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
            <tr>
                <td id="img-flexbox"><div class="country-img" style="background-image: url(${
                  country.countryInfo.flag
                })"></div>${country.country}</td>
                <td>${numeral(country.cases).format("0,0")}</td>
            </tr>
        `;
    document.getElementById("table-data").innerHTML = html;
  });
};
