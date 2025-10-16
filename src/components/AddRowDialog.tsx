import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';
import { addRow, Row } from '@/store/tableSlice';
import { RootState } from '@/store/store';

interface AddRowDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddRowDialog = ({ open, onClose }: AddRowDialogProps) => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.table.columns);
  const [formData, setFormData] = useState<Record<string, string | number>>({});

  const handleSubmit = () => {
    const newRow: Row = {
      id: Date.now().toString(),
      ...formData,
    };

    // Ensure all columns have values
    columns.forEach(col => {
      if (!(col.field in newRow)) {
        newRow[col.field] = col.type === 'number' ? 0 : '';
      }
    });

    dispatch(addRow(newRow));
    setFormData({});
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    const column = columns.find(col => col.field === field);
    setFormData(prev => ({
      ...prev,
      [field]: column?.type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}>
        Add New Row
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'hsl(var(--card))' }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {columns.map(col => (
            <TextField
              key={col.field}
              label={col.headerName}
              type={col.type === 'number' ? 'number' : 'text'}
              value={formData[col.field] || ''}
              onChange={(e) => handleChange(col.field, e.target.value)}
              fullWidth
              variant="outlined"
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'hsl(var(--card))', p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'hsl(var(--muted-foreground))' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' },
          }}
        >
          Add Row
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRowDialog;
