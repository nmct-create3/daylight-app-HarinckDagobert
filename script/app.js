import { key } from "./config.js";
let htmlLocation, htmlsunrise, htmlsunset, htmlsun, htmltimeleft;

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = "0" + date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ":" + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
let updateSun = (percentage) => {
  const sunPositionLeft = `${100 - percentage}%`;
  const sunPositionBottom = `${percentage + 5}%`;
  htmlsun.style.left = `${sunPositionLeft}`;
  htmlsun.style.bottom = `${sunPositionBottom}`;
};
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (sunrise, sunset) => {
  console.log("run");
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  // Bepaal het aantal minuten dat de zon al op is.
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
  const now = Date.now() / 1000;
  const minutesleft = Math.round(sunset / 60 - now / 60);
  UpdateTimeLeft(minutesleft);
  htmlsun.setAttribute("data-time", _parseMillisecondsIntoReadableTime(now));
  const percentage = Math.round((minutesleft / (sunset / 60 - sunrise / 60)) * 100);
  updateSun(percentage);
  document.body.classList.add("is-loaded");
};

let UpdateTimeLeft = (totalTime) => {
  //   htmlsun.dataSet.time = new Date().getTime();
  htmltimeleft.textContent = totalTime;
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  htmlLocation.textContent = `${queryResponse["name"]}, ${queryResponse["country"]}`;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  const sunrise = _parseMillisecondsIntoReadableTime(queryResponse.sunrise);
  const sunset = _parseMillisecondsIntoReadableTime(queryResponse.sunset);
  htmlsunrise.textContent = sunrise;
  htmlsunset.textContent = sunset;
  // const today = new Date(milliseconds);
  // totalTime = today;
  // console.log(totalTime);
  // UpdateTimeLeft();
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  const idinter = setInterval(placeSunAndStartMoving(queryResponse.sunrise, queryResponse.sunset), 1000);
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
};

const getData = (endpoint) => {
  return fetch(endpoint)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

const getEndpoint = (lat, lon) => {
  return `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=nl&cnt=1`;
};
// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  //   const data = await getData(getEndpoint(lat, lon));
  const data = await getData(getEndpoint(lat, lon));
  showResult(data["city"]);
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
};
const getDomElements = () => {
  htmlLocation = document.querySelector(".js-location");
  htmlsunrise = document.querySelector(".js-sunrise");
  htmlsunset = document.querySelector(".js-sunset");
  htmltimeleft = document.querySelector(".js-time-left");
  htmlsun = document.querySelector(".js-sun");
  if (!htmlsunrise || !htmlsunset || !htmltimeleft) {
    throw new Error("DOM elements not found.");
  }
};
document.addEventListener("DOMContentLoaded", function () {
  // 1 We will query the API with longitude and latitude.
  getDomElements();
  getAPI(50.8027841, 3.2097454);
});
