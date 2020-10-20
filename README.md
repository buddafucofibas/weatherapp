# WeatherApp

Hello and welcome to my humble app. It's pretty self-explanatory, it's an app to get the current, hourly, and 5 day forecast for any location within the united states.

## How to use

The app fetches data from the AccuWeather API and as such requires an API key. In order to make the app work create a file called `config.js` in the main directory.
In this file create a `config` object with a property called `API_KEY` and set the value to a valid AccuWeather key. AccuWeather has free keys but they're limited to 50 calls a day. The app uses 3 calls per search.

```js
const config = {
    API_KEY: '<your API key>';
}
```

Also the default search location is Columbia, MD for now as I've yet to implement any sort of means of detecting the users' location. I hope to implement this feature sometime in the near future.

You can search by city and state, or zip-code.

## Other Notes

One last thing, this is also my first README :-D.
