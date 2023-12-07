import React from 'react';
import { useState } from 'react';
import { MagnifyingGlassIcon, CloudIcon, SunIcon } from '@heroicons/react/24/outline';
import Checkbox from './checkbox';
import ColorSelector from './row2';

const WeatherDisplay = () => {
  
  const [search, setSearch] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [weather, setWeather] = useState({});
  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);

    fetch('https://iogqzpsi61.execute-api.us-east-1.amazonaws.com/dev/update-bool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(isChecked),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error sending weather data to Lambda:', error);
      });
  };

  const searchPressed = () => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=c031c9ffda4454a5cd537aad4bed0deb`)
      .then(res => res.json())
      .then(result => {
        const { lat, lon } = result[0];
        setLocationData({ lat, lon });
  
        console.log("Latitude:", lat);
        console.log("Longitude:", lon);
  
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c031c9ffda4454a5cd537aad4bed0deb`)
          .then(res => res.json())
          .then(result => {
            setWeather(result);
            console.log("weather", result);
  
            const transformedWeatherData = transformWeatherData(result);
            if (transformedWeatherData) {
              sendWeatherData(transformedWeatherData);
            } else {
              console.error('Invalid transformed weather data');
            }
  
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c031c9ffda4454a5cd537aad4bed0deb`);
          })
          .then(res => res.json())
          .then(result => {
            console.log("Forecast data:", result);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
      });
  };

  const transformWeatherData = (result) => {
    const transformedData = {
      type: { S: 'Weather' },
      coord: {
        M: {
          lat: { N: result.coord.lat.toString() },
          lon: { N: result.coord.lon.toString() },
        },
      },
      main: {
        M: {
          feels_like: { N: result.main.feels_like.toString() },
          pressure: { N: result.main.pressure.toString() },
          temp: { N: result.main.temp.toString() },
          temp_max: { N: result.main.temp_max.toString() },
          temp_min: { N: result.main.temp_min.toString() },
        },
      },
      name: { S: result.name },
      weather: {
        L: [
          {
            M: {
              description: { S: result.weather[0].description },
              icon: { S: result.weather[0].icon },
              id: { N: result.weather[0].id.toString() },
              main: { S: result.weather[0].main },
            },
          },
        ],
      },
      wind: {
        M: {
          deg: { N: result.wind.deg.toString() },
          speed: { N: result.wind.speed.toString() },
        },
      },
    };
  
    return transformedData;
  };  
  
  const sendWeatherData = (transformedWeatherData) => {
  
    fetch('https://iogqzpsi61.execute-api.us-east-1.amazonaws.com/dev/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedWeatherData),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error sending weather data to Lambda:', error);
      });
  };

  const weatherIcons = () => {
    switch (weather.weather[0].main) {
      case "Clouds":
        return <CloudIcon className="w-1/6 text-gray-800 h-1/6" aria-hidden="true" />
      default:
        return <SunIcon className="w-1/6 text-gray-800 h-1/6" aria-hidden="true" />
    }
  };

  return (
    <div className="flex items-start px-4 py-8 bg-white">
      <div className="flex flex-col w-full pb-4 bg-white rounded-lg shadow-md">
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col items-start justify-start px-4'>
            <p className="text-4xl text-gray-800">Welcome home.</p>
            <p className="px-1 text-gray-800 text-small">Here's your look at the weather.</p>
          </div>
          <div className='flex items-end mx-4 my-2 space-x-2 justify-self-end'>
            <Checkbox label="Use weather display?" checked={isChecked} onChange={handleCheckboxChange} />
            <input 
            type="text" 
            placeholder='Louisville' 
            className='block px-1 py-1 rounded-md outline outline-gray-800'
            onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="relative p-1 text-gray-800 bg-white rounded-full hover:text-gray-800"
              onClick={searchPressed}
            >
              <span className="absolute -inset-1.5" />
              <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>  
      {weather.name && (
        <div>


          <div className='flex flex-row items-center justify-center pt-8 pl-16'>  
          <div className='flex flex-col items-center justify-center pl-4'>          
            <p className="text-4xl text-gray-800">{Math.round(weather.main.temp)}°F</p> 
            <p className="text-sm text-gray-800">Feels like {Math.round(weather.main.feels_like)}°F</p>
          </div>
            <p className='pl-24 text-3xl text-gray-800'>{weather.name}</p>
            <div className='flex flex-col items-center justify-center'>
              {weatherIcons()}
              <p className="text-sm text-gray-800">{weather.weather[0].main}</p>
            </div>
          </div>
          <div className='flex flex-row justify-center space-x-10 space-y-9'>
            <p className="text-sm text-gray-400 pt-9">High for today: {Math.round(weather.main.temp_max)}°F</p>
            <p className="text-sm text-gray-400">Low for today: {Math.round(weather.main.temp_min)}°F</p>
            <p className="text-sm text-gray-400">Wind {weather.wind.speed} mph</p>  
          </div>
        </div>
      )}
      </div>
      <ColorSelector/>
    </div>
  );
};

export default WeatherDisplay;
