import React from 'react';

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean;
}

const CustomSelect: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
}) => {
  // Crée un texte de placeholder à partir du label (par ex. "Choisissez un niveau :")
  const placeholderText = `-- ${label.replace(':', '')} --`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
      >
        <option value="">
          {placeholderText}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;