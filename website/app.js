/* Global Variables */
const apikey = '628ba830bbbef210f41a6ee60fee6663&units=metric'; // added query parameter in the API key for the request

const date = new Date();
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const yearMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const localServer = 'localhost:3000'

let projectData = {};

/* creating weather obbbject to contain all the weather functions and variables */
let weather = {
  /* get the weather info using fetch API from the weather site */
  getInfo(zipCode) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apikey}`)
      .then(res => res.json())
      .then(data => {
        this.display(data);
      }).catch(err => {
        document.querySelector('.search-bar').classList.toggle('error'); //if the user entered wrong zip code add error class to the search bar to display error
        console.log(err);
      })
  },
  search() {
    this.getInfo(document.querySelector('.search .search-bar').value);
  },
  /* display the data on the website */
  display(data) {
    //data destruction for data object to fill out individual variables
    const { name } = data;
    const { country } = data.sys;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { description, icon } = data.weather[0];

    /* create the date and time formate that will be displayed */
    let today = `${weekDays[date.getDay()]} ${date.getDate()}, ${yearMonths[date.getMonth()]} ${date.getFullYear()}`;
    let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    /* get the HTML elements to change it according to the fetched data */
    document.querySelector('.weather .city').innerText = `Weather in ${name}, ${country}`;
    document.querySelector('.weather .temp').innerText = `${temp.toFixed(0)}°C`;
    document.querySelector('.weather .icon').setAttribute('src', `http://openweathermap.org/img/wn/${icon}.png`);
    document.querySelector('.weather .description').innerText = `${description}`;
    document.querySelector('.weather .humidity').innerText = `Humidity: ${humidity}%`;
    document.querySelector('.weather .wind-speed').innerText = `Wind speed: ${speed} km/h`;
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
    document.querySelector('.weather .date').innerText = today;
    document.querySelector('.weather .time').innerText = time;

    let feeling = document.querySelector('.search .feeling').value;
    if (feeling == '') feeling = 'happy'; //check if the user left the feeling bar empty to fill it happy by default
    document.querySelector('.your-feeling').innerHTML = `You're feeling <span>${feeling}</span>`;

    document.querySelector('.weather').classList.remove('hide-details');
    document.querySelector('.search-bar').classList.remove('error');

    //send the data to my server
    const projectData = { temp, today, feeling }
    postData(`/add`, projectData);
    retrieveData();
  }
}
/* when the user click in search button start searching */
document.querySelector('.search-btn').addEventListener('click', () => {
  weather.search();
})

/* when the user press Enter on the Keyboard start searching */
document.querySelectorAll('input').forEach(e => {
  e.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      weather.search();
    }
  })
})

/* make an async function that makes a post request */
async function postData(url, data = {}) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  try {
    const newData = await res.json();
    // console.log(newData);
    return newData;
  }
  catch (error) {
    console.log(error);
  }
};

async function retrieveData() {
  const req = await fetch('/all');
  try {
    // Transform into JSON
    const allData = await req.json();
    console.log(allData)
    // Write updated data to DOM elements
    document.querySelector('.weather .temp').innerHTML = Math.round(allData.temp) + '°C';
    document.querySelector('.search .feeling').innerHTML = allData.feeling;
    document.querySelector('.weather .date').innerHTML = allData.today;
  }
  catch (error) {
    // appropriately handle the error
    console.log("error", error);
  };
}