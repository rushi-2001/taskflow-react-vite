import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import { taskValidationSchema } from './taskValidationSchema';
import type { Task, TaskDraft } from '@/types/task.types';

interface TaskFormDialogProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSubmit: (values: TaskDraft) => void;
  isLoading: boolean;
}

export default function TaskFormDialog({
  open,
  task,
  onClose,
  onSubmit,
  isLoading,
}: TaskFormDialogProps) {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: '',
    },
    validationSchema: taskValidationSchema,
    onSubmit: (values) => {
      const payload: TaskDraft = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate : undefined,
      };
      onSubmit(payload);
    },
  });

  useEffect(() => {
    if (open) {
      if (task) {
        formik.setValues({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
      } else {
        formik.resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            required
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
            helperText={formik.touched.dueDate && formik.errors.dueDate}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isLoading} variant="text" color="inherit">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} variant="contained" sx={{ fontWeight: 600 }}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : task ? (
              'Save Changes'
            ) : (
              'Create Task'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
