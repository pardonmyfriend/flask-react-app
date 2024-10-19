import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import FileUploader from './FileUploader';

const DataTable = ({ rows, columns }) => {

    if (!rows || !columns) {
        return <p>No data available</p>;  // Alternatywny komunikat, jeśli brak danych
    }

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <h2>Your file</h2>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={!rows.length}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
            />
        </Box>
    )
}

export default DataTable;