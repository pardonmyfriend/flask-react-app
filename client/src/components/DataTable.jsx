import React, { useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';  

const DataTable = ({ data }) => {

    
    if (!data || !data.rows || !data.columns) {
        return <p>No data available</p>;
    }
    else {
        // setActiveStepFulfilled(1);
        return (
            <Box sx={{ height: 500, width: '100%' }}>
                <h2>Twój plik</h2>
                <DataGrid
                    rows={data.rows}
                    columns={data.columns}
                    loading={!data.rows.length}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    //density='compact'
                    showCellVerticalBorder = 'true'
                    showColumnVerticalBorder = 'true'
                    checkboxSelection = 'true'
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                          fontWeight: 'bold', 
                          fontSize: '17px',
                        },
                        '& .MuiDataGrid-row:nth-of-type(2n)': {
                            backgroundColor: '    #f6f6f6  ', 
                        },
                        '& .MuiDataGrid-toolbar': {
                            color: 'white', // Dodatkowe ustawienia dla kolorów w DataGrid
                        },
                        '& .MuiButton-textPrimary': {
                            color: 'white !important', 
                        },
                        '& .MuiTypography-root': {
                            color: 'white !important', // Ustaw kolor tekstu na biały dla typografii
                        },
                        '& .MuiButtonBase-root': {
                            color: 'white !important', // Ustaw kolor tekstu na biały dla przycisków
                        },
                        '& .MuiSvgIcon-root' : {
                            color: '  #3fbdbd !important',
                        },
                        '& .MuiDataGrid-columnsManagement' : {
                            backgroundColor: '  #3fbdbd !important',
                        },
                      }}
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      slotProps={{
                        toolbar: {
                          sx: {
                            backgroundColor: '   #474747', // Przykładowy kolor tła
                            fontWeight: 'bold', // Pogrubienie tekstu
                            padding: '10px', // Dodatkowe odstępy
                            fontSize: '30px',
                            color: ' #ffffff',
                            '& .MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-colorPrimary MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-colorPrimary css-8iab9z-MuiButtonBase-root-MuiButton-root': { // Stylizacja typografii w toolbarze
                            color: 'white', // Ustaw kolor tekstu na biały
                            }
                          },
                        },
                      }}
                />
            </Box>
        )
    }
    
}

export default DataTable;