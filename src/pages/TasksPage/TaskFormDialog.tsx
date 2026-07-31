import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import { taskValidationSchema } from './taskValidationSchema';
import { Task, TaskDraft } from '@/types/task.types';

interface TaskFormDialogProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSubmit: (values: TaskDraft) => void;
  isLoading: boolean;
}

export default function TaskFormDialog({ open, task, onClose, onSubmit, isLoading }: TaskFormDialogProps) {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium' as const,
      dueDate: '',
    },
    validationSchema: taskValidationSchema,
    onSubmit: (values) => {
      const payload: TaskDraft = {
        title: values.title,
        description: values.description,
        priority: values.priority as any,
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
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
      } else {
        formik.resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
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
          <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
            <InputLabel id="dialog-priority-label">Priority *</InputLabel>
            <Select
              labelId="dialog-priority-label"
              name="priority"
              label="Priority *"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            {formik.touched.priority && formik.errors.priority && (
              <FormHelperText>{formik.errors.priority}</FormHelperText>
            )}
          </FormControl>
          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
