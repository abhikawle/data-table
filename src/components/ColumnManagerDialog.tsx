import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { deleteColumn } from '@/store/tableSlice';
import { RootState } from '@/store/store';

interface ColumnManagerDialogProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManagerDialog = ({ open, onClose }: ColumnManagerDialogProps) => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.table.columns);

  const handleDelete = (field: string) => {
    if (confirm(`Are you sure you want to delete column "${field}"? This will remove data from all rows.`)) {
      dispatch(deleteColumn(field));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}>
        Manage Columns
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'hsl(var(--card))' }}>
        <List>
          {columns.map((col) => (
            <ListItem
              key={col.field}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(col.field)}
                  sx={{ color: 'hsl(var(--destructive))' }}
                >
                  <Delete />
                </IconButton>
              }
              sx={{
                mb: 1,
                bgcolor: 'hsl(var(--muted))',
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{col.headerName}</span>
                    <Chip
                      label={col.type}
                      size="small"
                      sx={{
                        bgcolor: 'hsl(var(--primary) / 0.1)',
                        color: 'hsl(var(--primary))',
                      }}
                    />
                  </Stack>
                }
                secondary={`Field: ${col.field}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'hsl(var(--card))', p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{
          bgcolor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
        }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManagerDialog;
