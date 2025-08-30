import React from 'react';

export interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const CustomSelect: React.FC<SelectProps> = ({ id, label, value, options, onChange, disabled }) => (
  <div style={{ marginBottom: '16px' }}>
    <label htmlFor={id} style={{ marginRight: '8px', fontWeight: 'bold' }}>{label}</label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ padding: '8px', borderRadius: '4px', minWidth: '160px' }}
    >
      <option value="">-- Sélectionner --</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default CustomSelect;
