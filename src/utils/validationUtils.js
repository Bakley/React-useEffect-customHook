export const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value) error = 'Username is required';
        else if (value.length < 3) error = 'Username must be at least 3 characters';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
        break;
      default:
        break;
    }
    return error;
  };
  
  export const isFormValid = (credentials, errors) => {
    return (
      credentials.username &&
      credentials.password &&
      credentials.email &&
      !errors.username &&
      !errors.password &&
      !errors.email
    );
  };
  