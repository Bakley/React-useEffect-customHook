import React from 'react';

function Input({ label, type = 'text', value, onChange, name, required = false }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        {label}
        <input
          type={type}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          style={{ display: 'block', width: '100%', padding: '0.5rem' }}
        />
      </label>
    </div>
  );
}

export default Input;