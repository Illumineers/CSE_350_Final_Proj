import React, { useState } from 'react';
import { SliderPicker } from 'react-color';

const ColorSelector = () => {
  const [color, setColor] = useState('#ff0000');

  const updateColor = async (newColor) => {
    try {
      const response = await fetch('https://iogqzpsi61.execute-api.us-east-1.amazonaws.com/dev/sendColor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newColor.rgb),
      });

      if (response.ok) {
        console.log('Color updated successfully');
      } else {
        console.error('Error updating color:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating color:', error);
    }
  };


  return (
    <div className="flex px-4 py-2 space-x-4 bg-white justify-items-start">
      <div className="flex flex-col items-start justify-center w-full px-2 bg-white rounded-lg shadow-md">
        <div>
        <p className="px-4 pt-4 text-4xl text-gray-800">Color Selection</p>
        </div>
        <div className='justify-center px-8 pb-8'>
          <p className="px-2 text-sm text-white">______________________________</p> 
          <p className="px-2 pt-5 pb-4 text-sm text-gray-400">Use the selector below to adapt the color of your lights!</p>
          <SliderPicker
            color={color}
            onChangeComplete={(newColor) => {
              setColor(newColor.rgb);
              updateColor(newColor);
              console.log(newColor.rgb)
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
