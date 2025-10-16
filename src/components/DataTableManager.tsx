import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { Add, FileUpload, FileDownload, ViewColumn, Delete } from '@mui/icons-material';
import { RootState } from '@/store/store';
import { deleteRow, updateRow } from '@/store/tableSlice';
import AddRowDialog from './AddRowDialog';
import AddColumnDialog from './AddColumnDialog';
import ImportExportDialog from './ImportExportDialog';
import ColumnManagerDialog from './ColumnManagerDialog';

const DataTableManager = () => {
  const dispatch = useDispatch();
  const { columns, rows } = useSelector((state: RootState) => state.table);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  const handleDeleteRow = (id: string) => {
    if (confirm('Are you sure you want to delete this row?')) {
      dispatch(deleteRow(id));
    }
  };

  const gridColumns: GridColDef[] = [
    ...columns.map(col => ({
      ...col,
      editable: true,
      sortable: true,
    })),
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Delete style={{ color: 'hsl(0 84% 60%)' }} />}
          label="Delete"
          onClick={() => handleDeleteRow(params.id as string)}
        />,
      ],
    },
  ];

  const gridRows: GridRowsProp = rows;

  const handleRowUpdate = (newRow: any) => {
    dispatch(updateRow(newRow));
    return newRow;
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: 'hsl(var(--background))', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'hsl(var(--card))', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'hsl(var(--foreground))', mb: 1 }}>
          Dynamic Data Table Manager
        </Typography>
        <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
          Manage your data with dynamic columns, import/export, and full CRUD operations
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'hsl(var(--card))', borderRadius: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddRowOpen(true)}
            sx={{
              bgcolor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' },
            }}
          >
            Add Row
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewColumn />}
            onClick={() => setAddColumnOpen(true)}
            sx={{
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          >
            Add Column
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewColumn />}
            onClick={() => setColumnManagerOpen(true)}
            sx={{
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          >
            Manage Columns
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileUpload />}
            onClick={() => setImportExportOpen(true)}
            sx={{
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          >
            Import/Export
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ height: 'calc(100vh - 300px)', bgcolor: 'hsl(var(--card))', borderRadius: 2 }}>
        <DataGrid
          rows={gridRows}
          columns={gridColumns}
          processRowUpdate={handleRowUpdate}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
              borderColor: 'hsl(var(--border))',
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: 'hsl(var(--border))',
            },
          }}
        />
      </Paper>

      <AddRowDialog open={addRowOpen} onClose={() => setAddRowOpen(false)} />
      <AddColumnDialog open={addColumnOpen} onClose={() => setAddColumnOpen(false)} />
      <ImportExportDialog open={importExportOpen} onClose={() => setImportExportOpen(false)} />
      <ColumnManagerDialog open={columnManagerOpen} onClose={() => setColumnManagerOpen(false)} />
    </Box>
  );
};

export default DataTableManager;
