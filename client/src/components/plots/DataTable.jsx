import React from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function DataTable({ rows, cols }) {
    const dataGridStyle = {
        verflowY: 'auto',
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            fontSize: '17px',
        },
        '& .MuiDataGrid-row:nth-of-type(2n)': {
            backgroundColor: '#f6f6f6',
        },
        '& .MuiDataGrid-toolbar': {
            color: 'white',
        },
        '& .MuiButton-textPrimary': {
            color: 'white !important',
        },
        '& .MuiTypography-root': {
            color: 'white !important',
        },
        '& .MuiButtonBase-root': {
            color: 'white !important',
        },
        '& .MuiSvgIcon-root': {
            color: '#3fbdbd !important',
        },
        '& .MuiDataGrid-columnsManagement': {
            backgroundColor: '#3fbdbd !important',
        },
    };

  return (
    <DataGrid
        rows={rows}
        columns={cols}
        loading={!rows.length}
        showCellVerticalBorder
        showColumnVerticalBorder
        checkboxSelection={false}
        initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        sx={dataGridStyle}
        slots={{
            toolbar: GridToolbar,
        }}
        slotProps={{
            toolbar: {
                sx: {
                    backgroundColor: '#474747',
                    fontWeight: 'bold',
                    padding: '10px',
                    fontSize: '30px',
                    color: '#ffffff',
                    '& .MuiButtonBase-root': {
                        color: 'white',
                    },
                },
            },
        }}
    />
  )
}

export default DataTable