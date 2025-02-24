import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import { validateField, isFormValid } from "../utils/validationUtils";

const API_URL = 'http://localhost:3000';

function RegisterForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value, credentials);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (creds) => {
    const newErrors = {
      username: validateField('username', creds.username),
      password: validateField('password', creds.password),
      confirmPassword: validateField('confirmPassword', creds.confirmPassword, creds),
      email: validateField('email', creds.email),
    };
    setErrors(newErrors);
    return isFormValid(creds, newErrors);
  };

  const attemptRegistration = async (creds) => {
    if (!isFormValid(creds, errors) || loading) return;

    setLoading(true);
    setStatus('');

    const registerData = {
      username: creds.username,
      password: creds.password,
      email: creds.email,
    };

    try {
      const checkResponse = await fetch(`${API_URL}/users?username=${creds.username}`);
      if (!checkResponse.ok) throw new Error('Network error: Failed to check username');
      const users = await checkResponse.json();

      if (users.length > 0) {
        setStatus('Username already taken');
      } else {
        const createResponse = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerData),
        });
        if (!createResponse.ok) throw new Error('Server error: Failed to register user');
        const newUser = await createResponse.json();
        setStatus(`Registered successfully: ${newUser.username} (ID: ${newUser.id})`);
        setCredentials({ username: '', password: '', confirmPassword: '', email: '' });
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    if (isSubmitted && isFormValid(credentials, errors)) {
      const timeoutId = setTimeout(() => {
        attemptRegistration(credentials);
      }, 500); // Manual debounce 500ms

      return () => clearTimeout(timeoutId); // Cleanup
    }
  }, [credentials, errors, isSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    if (validateForm(credentials)) {
      setIsSubmitted(true);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
          disabled={loading}
          aria-describedby="username-error"
        />
        {errors.username && (
          <p id="username-error" style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.username}
          </p>
        )}
        <Input
          label="Email"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
          disabled={loading}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.email}
          </p>
        )}
        <Input
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          disabled={loading}
          aria-describedby="password-error"
        />
        {errors.password && (
          <p id="password-error" style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.password}
          </p>
        )}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={credentials.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
          aria-describedby="confirmPassword-error"
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.confirmPassword}
          </p>
        )}
        <Button type="submit" disabled={loading || !isFormValid(credentials, errors)}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      {status && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}

export default RegisterForm;
