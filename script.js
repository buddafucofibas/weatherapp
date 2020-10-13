// location key for columbia MD: 329306
// api: ***REMOVED***

// utility function to make DOM manipulation a little faster
const label = (text) => document.querySelector(text);
const make = (element) => document.createElement(element);
const makeDiv = (className) => {
  let e = document.createElement('div');
  e.classList.add(className);
  return e;
};

// grabbing DOM elements
const currentButton = label('#current_weather');
const fiveDayButton = label('#five_day_weather');
const weather = document.querySelector('.weather');
const date = label('.date');
const time = label('.time');
const search = label('#search');
const twelveHours = document.querySelector('.twelve_hours');
const news = label('.news');
const cityDisplayMain = label('.current_location p');
const currentWeatherIcon = label('.weather_icon img');
const currentWeatherDescription = label('.weather_desc p');
const currentTemp = label('.temp');
const currentRealTemp = label('.real');
const relativeHumidity = label('.humidity span');
const visibility = label('.visibility span');
const pointer = label('.pointer img');
const windDirection = label('.direction');
const windSpeed = label('.speed');
const uv = label('.uv_index span');
let currentCity, city, state, key;

// displays date and time when DOM loads
displayDT();

search.addEventListener('keyup', getLocation);

currentButton.addEventListener('click', function () {
  this.classList.add('active');
  fiveDayButton.classList.remove('active');
  weather.classList.add('current');
  weather.classList.remove('five_day');
});

fiveDayButton.addEventListener('click', function () {
  this.classList.add('active');
  currentButton.classList.remove('active');
  weather.classList.add('five_day');
  weather.classList.remove('current');
});

(async () => {
  resetDisplays();
  const raw = await fetch(
    `http://dataservice.accuweather.com/locations/v1/US/search?apikey=***REMOVED***&q=columbia%20maryland&language=en-us&details=true`
  );
  const parsed = await raw.json();
  currentCity = parsed[0];
  state = currentCity.AdministrativeArea.ID;
  city = currentCity.LocalizedName;
  cityDisplayMain.textContent = `${city}, ${state}`;
  key = currentCity.Details.CanonicalLocationKey;
  console.log(key);

  getCurrentWeather();
  getFiveDay();
  resetDisplays();
  getHourly();
  getNews();
})();

window.onresize = toggleView;
// gets location key and 12 hour forecast for user entered city or zipcode.
async function getLocation(event) {
  if ((event.keyCode === 13) & (search.value !== '')) {
    const value = search.value;
    search.value = '';
    const raw = await fetch(
      `http://dataservice.accuweather.com/locations/v1/US/search?apikey=***REMOVED***&q=${value}&language=en-us&details=true`
    );
    const parsed = await raw.json();
    currentCity = parsed[0];
    state = currentCity.AdministrativeArea.ID;
    city = currentCity.LocalizedName;
    cityDisplayMain.textContent = `${city}, ${state}`;
    key = currentCity.Details.CanonicalLocationKey;
    console.log(key);

    resetDisplays();
    getCurrentWeather();
    getHourly();
    getNews();
  }
}

// gets current forecast and updates display
async function getCurrentWeather() {
  const raw = await fetch(
    `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=***REMOVED***&language=en-us&details=true`
  );
  const parsed = await raw.json();
  const currentConditions = parsed[0];
  currentWeatherIcon.setAttribute(
    'src',
    `https://www.accuweather.com/images/weathericons/${currentConditions.WeatherIcon}.svg`
  );
  currentWeatherIcon.setAttribute('alt', `${currentConditions.WeatherText} icon`);
  currentWeatherDescription.textContent = currentConditions.WeatherText;
  currentTemp.innerHTML = `${currentConditions.Temperature.Imperial.Value}&degF`;
  currentRealTemp.innerHTML = `Feels like ${currentConditions.RealFeelTemperature.Imperial.Value}&degF`;
  relativeHumidity.textContent = `${currentConditions.RelativeHumidity}%`;
  visibility.textContent = `${currentConditions.Visibility.Imperial.Value}`;
  windDirection.textContent = `${currentConditions.Wind.Direction.Localized}`;
  windSpeed.textContent = `${currentConditions.Wind.Speed.Imperial.Value} mi/h`;
  uv.textContent = `${currentConditions.UVIndex}: ${currentConditions.UVIndexText}`;
  pointer.setAttribute(
    `style`,
    `transform: rotate(${currentConditions.Wind.Direction.Degrees}deg)`
  );
  pointer.setAttribute(`alt`, `Compass pointing ${currentConditions.Wind.Direction.Localized}`);
  // update time that information was received.
  displayTime();
}

// Gets the hourly forecast for the next twelve hours and creates hour 'cards' displaying a brief look at the upcoming forecast.
async function getHourly() {
  const raw = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=***REMOVED***&language=en-us`
  );
  const parsed = await raw.json();

  parsed.forEach((e) => {
    const hour = convertTime(e.DateTime);
    const weatherIcon = e.WeatherIcon;
    const weatherDescription = e.IconPhrase;
    const temp = e.Temperature.Value;
    const precipPossibility = e.PrecipitationProbability;

    console.log(precipPossibility);

    // create hourly card
    let hourCard = document.createElement('div');
    hourCard.classList.add('hour');
    // creates time and adds it to card
    let hourText = document.createElement('p');
    hourText.classList.add('hour_text');
    hourText.textContent = hour;
    hourCard.append(hourText);

    // create hour summary
    let hourSum = document.createElement('div');
    hourSum.classList.add('hour_sum');

    // create icon image
    let hourIcon = document.createElement('img');
    hourIcon.classList.add('hour_icon');
    hourIcon.setAttribute(
      'src',
      `https://www.accuweather.com/images/weathericons/${weatherIcon}.svg`
    );
    hourIcon.setAttribute('alt', `${weatherDescription} icon`);

    // create hour temp
    let hourTemp = document.createElement('span');
    hourTemp.classList.add('hour_temp');
    hourTemp.innerHTML = `${temp}&degF`;

    // add weather icon and temp to hour summary
    hourSum.append(hourIcon);
    hourSum.append(hourTemp);

    // add hour summary to hourcard
    hourCard.append(hourSum);

    // create precipitation probability
    let precipWrapper = document.createElement('div');

    // create raindrop img
    let raindrop = document.createElement('img');
    raindrop.classList.add('precip');
    raindrop.setAttribute(
      'src',
      'https://www.accuweather.com/images/components/weather/hourly-card-nfl/drop-icon.svg'
    );
    raindrop.setAttribute('alt', 'rain drop');

    // create precipitation chance span
    let probability = document.createElement('span');
    probability.textContent = `${precipPossibility}%`;

    // add raindrop and precipitation chances to div
    precipWrapper.append(raindrop);
    precipWrapper.append(probability);

    // add precip chances to hourly card
    hourCard.append(precipWrapper);

    twelveHours.append(hourCard);
  });
}

// Gets forecast for the next 5 days
async function getFiveDay() {
  const raw = await fetch(
    'http://dataservice.accuweather.com/forecasts/v1/daily/5day/329306?apikey=***REMOVED***&language=en-us&details=true'
  );
  const parsed = await raw.json();
  // console.log(parsed);

  parsed.DailyForecasts.forEach((day) => {
    makeWeatherCard(day);
  });
}
// grabs the first 9 weather related news based on location of city search & makes 'news cards'
async function getNews() {
  let raw = await fetch(
    `https://newsapi.org/v2/everything?q=weather+${city}+${state}&apiKey=a203b362e56d4020a279f55d6d9acb4f`
  );
  let parsed = await raw.json();
  let newsArticles = parsed.articles;

  for (let i = 0; i < 9; i++) {
    makeNewsCards(newsArticles[i]);
  }
}

// takes as a parameter a day forecast object and creates a daily weather card and adds it to
// the weather display

function makeWeatherCard(forecast) {
  const dayCard = makeDiv('day_card');
  const dateDiv = makeDiv('date');
  const icon = makeDiv('icon');
  const iconImg = make('img');
  const desc = makeDiv('desc');
  const highLow = makeDiv('high_low');
  const low = document.createElement('span');
  low.classList.add('low');
  const dayPrecip = makeDiv('day_precip');
  const precipIcon = document.createElement('img');
  const precipChances = document.createElement('span');

  const date = getDate(forecast.Date);
  dateDiv.textContent = date;
  dayCard.append(dateDiv);
  iconImg.setAttribute(
    'src',
    `https://www.accuweather.com/images/weathericons/${forecast.Day.Icon}.svg`
  );
  iconImg.setAttribute('alt', `${forecast.Day.IconPhrase} icon`);
  desc.textContent = forecast.Day.IconPhrase;
  icon.append(iconImg);
  icon.append(desc);
  dayCard.append(icon);

  highLow.innerHTML = `<div>${forecast.Temperature.Maximum.Value}</div>/`;
  low.textContent = forecast.Temperature.Minimum.Value;
  highLow.append(low);
  dayCard.append(highLow);

  precipIcon.setAttribute(
    'src',
    'https://www.accuweather.com/images/components/weather/daily-forecast-card-nfl/drop-icon.svg'
  );
  precipIcon.setAttribute('alt', 'raindrop icon indicating possibility of precipitation');
  precipChances.textContent = `${forecast.Day.PrecipitationProbability}%`;

  dayPrecip.append(precipIcon);
  dayPrecip.append(precipChances);
  dayCard.append(dayPrecip);

  weather.append(dayCard);
}

// make & add the newscard elements
function makeNewsCards(article) {
  const articleURL = article.url;
  const imageURL = article.urlToImage;
  const title = article.title;
  const subTitle = article.description;

  let newsCard = make('div');
  newsCard.classList.add('news_card');

  // make anchor tab to wrap whole card
  let a = make('a');
  a.setAttribute('href', articleURL);
  a.setAttribute('target', '_blank');

  // makes image wrapper
  let imgWrapper = make('div');
  imgWrapper.classList.add('news_img');

  // create image itself
  let img = make('img');
  img.setAttribute('src', imageURL);
  img.setAttribute(
    'alt',
    "this is generated dynamically so I have no f'ing idea. And I'm too new to know how to get it from the site...I'll find out though..."
  );

  // attach image to image wrapper
  imgWrapper.append(img);

  // Creates title and subtitle wrappers and inner content
  let titleWrapper = make('div');
  let titleContent = make('h2');
  titleWrapper.classList.add('news_title');
  titleContent.textContent = title;
  titleWrapper.append(titleContent);

  let subTitleWrapper = make('div');
  let subTitleContent = make('p');

  subTitleWrapper.classList.add('news_subtitle');
  subTitleContent.innerHTML = subTitle;
  subTitleWrapper.append(subTitleContent);

  // and attach it all
  newsCard.append(a);
  a.append(imgWrapper);
  a.append(titleWrapper);
  a.append(subTitleWrapper);
  newsCard.append(a);

  document.querySelector('.news').append(newsCard);
}

// Utility functions
// This functions takes a string as a parameter and extracts the time from it and converts to standard.
function convertTime(timeRaw) {
  let hour = Number(timeRaw.split('T')[1].split(':')[0]);

  if (hour === 0) {
    return '12am';
  } else if (hour === 12) {
    return '12pm';
  }
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

// updates date & time
function displayDT() {
  let now = new Date();
  date.textContent = now.toLocaleDateString();
  time.textContent = now.toLocaleTimeString();
}

// updates only time
function displayTime() {
  let now = new Date();
  time.textContent = now.toLocaleTimeString();
}

// clears displays
function resetDisplays() {
  twelveHours.innerHTML = '';
  news.innerHTML = '';
}

// gets month and day
function getDate(date) {
  date = date.split('T')[0];
  let [, month, day] = date.split('-');
  return `${month}/${day}`;
}

// toggles view to current
function toggleView() {
  if (window.innerWidth <= 768) {
    currentButton.classList.add('active');
    fiveDayButton.classList.remove('active');
    weather.classList.add('current');
    weather.classList.remove('five_day');
  }
}
