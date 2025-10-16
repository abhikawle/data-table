import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Alert,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { FileUpload, FileDownload } from '@mui/icons-material';
import Papa from 'papaparse';
import { setRows, Row } from '@/store/tableSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ImportExportDialog = ({ open, onClose }: ImportExportDialogProps) => {
  const dispatch = useDispatch();
  const { rows, columns } = useSelector((state: RootState) => state.table);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const importedRows: Row[] = results.data
            .filter((row: any) => Object.keys(row).length > 0)
            .map((row: any, index: number) => ({
              id: row.id || `imported-${Date.now()}-${index}`,
              ...row,
            }));

          dispatch(setRows(importedRows));
          toast.success(`Successfully imported ${importedRows.length} rows from CSV`);
          setError('');
          onClose();
        } catch (err) {
          setError('Failed to parse CSV file. Please check the format.');
          toast.error('Failed to import CSV');
        }
      },
      error: (err) => {
        setError(`CSV parsing error: ${err.message}`);
        toast.error('Failed to import CSV');
      },
    });
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error('JSON must be an array of objects');
        }

        const importedRows: Row[] = json.map((row, index) => ({
          id: row.id || `imported-${Date.now()}-${index}`,
          ...row,
        }));

        dispatch(setRows(importedRows));
        toast.success(`Successfully imported ${importedRows.length} rows from JSON`);
        setError('');
        onClose();
      } catch (err: any) {
        setError(`Failed to parse JSON: ${err.message}`);
        toast.error('Failed to import JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-export-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(rows, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-export-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('JSON exported successfully');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}>
        Import/Export Data
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'hsl(var(--card))' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Import" />
          <Tab label="Export" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'hsl(var(--foreground))' }}>
                Import from CSV
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUpload />}
                fullWidth
                sx={{ borderColor: 'hsl(var(--border))' }}
              >
                Choose CSV File
                <input type="file" hidden accept=".csv" onChange={handleImportCSV} />
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'hsl(var(--foreground))' }}>
                Import from JSON
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUpload />}
                fullWidth
                sx={{ borderColor: 'hsl(var(--border))' }}
              >
                Choose JSON File
                <input type="file" hidden accept=".json" onChange={handleImportJSON} />
              </Button>
            </Box>
            <Alert severity="info" sx={{ mt: 2 }}>
              Imported data will replace current rows. Make sure your file has the correct column names.
            </Alert>
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'hsl(var(--foreground))' }}>
                Export to CSV
              </Typography>
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={handleExportCSV}
                fullWidth
                sx={{
                  bgcolor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                Download CSV
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'hsl(var(--foreground))' }}>
                Export to JSON
              </Typography>
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={handleExportJSON}
                fullWidth
                sx={{
                  bgcolor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                Download JSON
              </Button>
            </Box>
            <Alert severity="info">
              Export includes all {rows.length} rows with {columns.length} columns.
            </Alert>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'hsl(var(--card))', p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'hsl(var(--muted-foreground))' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportExportDialog;
