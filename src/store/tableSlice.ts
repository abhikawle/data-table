import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Column {
  field: string;
  headerName: string;
  type: 'string' | 'number';
  width?: number;
  editable?: boolean;
}

export interface Row {
  id: string;
  [key: string]: string | number;
}

interface TableState {
  columns: Column[];
  rows: Row[];
}

const initialColumns: Column[] = [
  { field: 'name', headerName: 'Name', type: 'string', width: 150, editable: true },
  { field: 'email', headerName: 'Email', type: 'string', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', width: 100, editable: true },
  { field: 'tags', headerName: 'Tags', type: 'string', width: 150, editable: true },
  { field: 'status', headerName: 'Status', type: 'string', width: 120, editable: true },
];

const initialRows: Row[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, tags: 'developer', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, tags: 'designer', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, tags: 'manager', status: 'inactive' },
];

const initialState: TableState = {
  columns: initialColumns,
  rows: initialRows,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<Row>) => {
      state.rows.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<Row>) => {
      const index = state.rows.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter(row => row.id !== action.payload);
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
      // Add empty value for new column in all rows
      state.rows.forEach(row => {
        if (!(action.payload.field in row)) {
          row[action.payload.field] = action.payload.type === 'number' ? 0 : '';
        }
      });
    },
    updateColumn: (state, action: PayloadAction<{ oldField: string; column: Column }>) => {
      const { oldField, column } = action.payload;
      const index = state.columns.findIndex(col => col.field === oldField);
      if (index !== -1) {
        state.columns[index] = column;
        // Update field name in all rows if field changed
        if (oldField !== column.field) {
          state.rows.forEach(row => {
            row[column.field] = row[oldField];
            delete row[oldField];
          });
        }
      }
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.field !== action.payload);
      // Remove field from all rows
      state.rows.forEach(row => {
        delete row[action.payload];
      });
    },
    setData: (state, action: PayloadAction<{ columns: Column[]; rows: Row[] }>) => {
      state.columns = action.payload.columns;
      state.rows = action.payload.rows;
    },
    setRows: (state, action: PayloadAction<Row[]>) => {
      state.rows = action.payload;
    },
  },
});

export const {
  addRow,
  updateRow,
  deleteRow,
  addColumn,
  updateColumn,
  deleteColumn,
  setData,
  setRows,
} = tableSlice.actions;

export default tableSlice.reducer;
