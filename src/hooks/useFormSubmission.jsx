import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { validateField, isFormValid } from '../utils/validationUtils';

function useFormSubmission(initialCredentials, endpoint, onSubmit) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [errors, setErrors] = useState(
    Object.keys(initialCredentials).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  );
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const attemptSubmission = useCallback(
    debounce(async (creds) => {
      if (!isFormValid(creds, errors) || loading) return;

      setLoading(true);
      setStatus('');

      try {
        const checkResponse = await fetch(`${endpoint}?username=${creds.username}`);
        if (!checkResponse.ok) throw new Error('Failed to check user');
        const users = await checkResponse.json();

        if (users.length > 0) {
          const user = users[0];
          if (user.password === creds.password) {
            setStatus(`Welcome back, ${user.username}!`);
          } else {
            setStatus('Incorrect password');
          }
        } else {
          const createResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds),
          });
          if (!createResponse.ok) throw new Error('Failed to create user');
          const newUser = await createResponse.json();
          setStatus(`New user created: ${newUser.username} (ID: ${newUser.id})`);
        }
        onSubmit?.(true, status); // Callback for success
      } catch (error) {
        setStatus(`Error: ${error.message}`);
        onSubmit?.(false, error.message); // Callback for failure
      } finally {
        setLoading(false);
        setIsSubmitted(false);
      }
    }, 500),
    [errors, endpoint, onSubmit] // Dependencies
  );

  useEffect(() => {
    if (isSubmitted && isFormValid(credentials, errors)) {
      attemptSubmission(credentials);
    }
  }, [credentials, errors, isSubmitted, attemptSubmission]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const newErrors = Object.keys(credentials).reduce((acc, key) => ({
      ...acc,
      [key]: validateField(key, credentials[key]),
    }), {});
    setErrors(newErrors);

    if (isFormValid(credentials, newErrors)) {
      setIsSubmitted(true);
    }
  };

  return {
    credentials,
    errors,
    status,
    loading,
    handleChange,
    handleSubmit,
    isFormValid: () => isFormValid(credentials, errors),
  };
}

export default useFormSubmission;
