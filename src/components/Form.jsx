import React from 'react';

function Form({ onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    >
      {children}
    </form>
  );
}

export default Form;