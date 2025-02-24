import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useFormSubmission from '../hooks/useFormSubmission';

function LoginForm() {
  const {
    credentials,
    errors,
    status,
    loading,
    handleChange,
    handleSubmit,
    isFormValid,
  } = useFormSubmission(
    { username: '', password: '' },
    'http://localhost:3000/users',
    (success, message) => {
      if (success) console.log('Submission successful:', message);
      else console.error('Submission failed:', message);
    }
  );

  return (
    <div>
      <h1>Auto-Login Form</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        {errors.username && (
          <p style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.username}
          </p>
        )}
        <Input
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        {errors.password && (
          <p style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.password}
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </Form>
      {status && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}

export default LoginForm;
