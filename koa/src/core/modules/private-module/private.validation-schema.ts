import * as yup from 'yup';

export const createPrivateItemSchema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required')
});

export const updatePrivateItemSchema = yup.object({
  title: yup.string(),
  content: yup.string()
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  (value) => {
    return Object.keys(value).length > 0;
  }
);