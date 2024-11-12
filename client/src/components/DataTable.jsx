import React, { useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';  


const DataTable = ({ data, onProceed }) => {

    //const [rows, setRows] = useState(data);
    const [deletedRows, setDeletedRows] = useState();
    const [selectionModel, setSelectionModel] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // const handleSelectionChange = (newSelection) => {
    //     console.log('handleSelectionChange wywołane');
    //     setSelectionModel(newSelection);

    //     const selectedRows = data.rows.filter((row) => newSelection.includes(row.id));
    //     console.log(selectedRows);
    //     console.log("sth done");
    //   };
    
    // const handleDeleteRows = async () => {
    //     const selectedRows = data.rows.filter((row) => selectionModel.includes(row.id));
    //     console.log(selectedRows);
    //     console.log(deletedRows);
    //     console.log("sth done");
    // }

    useEffect(() => {
        if (!data || !data.rows || !data.columns) {
            return <p>No data available</p>;
        }
        else {
            setIsDataLoaded(true);
            onProceed(true);
        }
        return () => {}; 
    }, [isDataLoaded, onProceed]);

    if(isDataLoaded) {
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
                    showCellVerticalBorder
                    showColumnVerticalBorder
                    checkboxSelection
                    //onSelectionModelChange={handleSelectionChange}
                    //selectionModel={selectionModel}
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
                {/* <Button variant="contained" color="secondary" onClick={handleDeleteRows} style={{ margin: '10px' }}>
                Usuń zaznaczone wiersze
                </Button> */}
            </Box>
        )
    }
    }

    


export default DataTable;