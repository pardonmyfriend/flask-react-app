import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import FileUploader from './FileUploader';

const DataTable = ({ data }) => {

    
    if (!data.rows || !data.columns) {
        return <p>No data available</p>;  // Alternatywny komunikat, jeśli brak danych
    }

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <h2>Twój plik</h2>
            <DataGrid
                rows={data.rows}
                columns={data.columns}
                loading={!data.rows.length}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                density='compact'
                showCellVerticalBorder = 'true'
                showColumnVerticalBorder = 'true'
                checkboxSelection = 'true'
                sx={{
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold', 
                      fontSize: '17px',
                    },
                    // '& .MuiDataGrid-columnHeaderTitleContainer': {
                    //   backgroundColor: 'red', 
                    // },
                    // '& .MuiDataGrid-topContainer': {
                    //   backgroundColor: 'red', 
                    // },
                    '& .MuiDataGrid-row:nth-child(2n)': {
                        backgroundColor: '  #eefdfd  ', 
                    },
                  }}
            />
        </Box>
    )
}

export default DataTable;