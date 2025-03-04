import * as yup from 'yup';

export const createUserValidationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['admin', 'user'], 'Invalid role').default('user')
});

export const updateUserValidationSchema = yup.object({
  name: yup.string(),
  email: yup.string().email('Invalid email format'),
  password: yup.string().min(8, 'Password must be at least 8 characters'),
  role: yup.string().oneOf(['admin', 'user'], 'Invalid role')
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  (value) => {
    return Object.keys(value).length > 0;
  }
);