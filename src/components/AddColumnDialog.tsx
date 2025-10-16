import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { addColumn, Column } from '@/store/tableSlice';

interface AddColumnDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddColumnDialog = ({ open, onClose }: AddColumnDialogProps) => {
  const dispatch = useDispatch();
  const [field, setField] = useState('');
  const [headerName, setHeaderName] = useState('');
  const [type, setType] = useState<'string' | 'number'>('string');

  const handleSubmit = () => {
    if (!field || !headerName) return;

    const newColumn: Column = {
      field,
      headerName,
      type,
      width: 150,
      editable: true,
    };

    dispatch(addColumn(newColumn));
    setField('');
    setHeaderName('');
    setType('string');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}>
        Add New Column
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'hsl(var(--card))' }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Field Name (ID)"
            value={field}
            onChange={(e) => setField(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            fullWidth
            helperText="Lowercase with underscores (e.g., phone_number)"
          />
          <TextField
            label="Display Name"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as 'string' | 'number')} label="Type">
              <MenuItem value="string">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'hsl(var(--card))', p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'hsl(var(--muted-foreground))' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!field || !headerName}
          sx={{
            bgcolor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' },
          }}
        >
          Add Column
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumnDialog;
