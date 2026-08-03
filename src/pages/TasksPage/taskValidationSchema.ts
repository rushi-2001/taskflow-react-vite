import * as Yup from 'yup';

export const taskValidationSchema = Yup.object({
  title: Yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .test('future-date', 'Due date cannot be in the past', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return value >= today;
    }),
});
