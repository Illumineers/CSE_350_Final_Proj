import React from 'react';
import './App.css';
import Header from './comps/header';
import WeatherDisplay from './comps/WeatherDisplay';
import ColorSelector from './comps/row2';

const weatherAPI = {
  key: 'c031c9ffda4454a5cd537aad4bed0deb',
  base: 'https://api.openweathermap.org/data/2.5/',
}

function App() {
  
  return (
    <div className="App">
        <div className='content'>
          <Header/>
          <WeatherDisplay/>
          {/* <ColorSelector/> */}
        </div>

    </div>
  );
}

export default App;
