import React from 'react';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        className="w-4 h-4 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-red-600 form-checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="pr-2 text-sm text-gray-400">{label}</span>
    </label>
  );
};

export default Checkbox;
