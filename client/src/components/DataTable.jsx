import React, { useEffect, useState } from 'react'
import { DataGrid, GridDeleteIcon, GridToolbar, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, IconButton } from '@mui/material';  


const DataTable = ({ data, onProceed }) => {

    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        console.log("Loaded data:", data);
        if (data && data.rows) {
            setRows(data.rows);
        }
        if (data && data.columns) {
            console.log(data.columns);
            setCols(data.columns);
        }
        console.log("Columns set to:", data.columns);
        console.log("Rows set to:", data.rows);
    }, [data]);

    const apiRef = useGridApiRef();

    const updateIds = (data) => {
        return data.map((row, index) => ({ ...row, id: index + 1 }));
    };

    const handleDeleteSelected = () => {
        setRows((prevRows) => {
             const updatedRows = prevRows.filter((row) => !selectedRows.includes(row.id));
             console.log(updatedRows);
             return updateIds(updatedRows);
    });
    };

    const handleDeleteColumn = (field) => {
        const newColumns = cols.filter(column => column.field !== field);
        console.log(newColumns);
        setCols(newColumns); 
        return newColumns;
      };

    const handleStateChange = () => {
        const selectedIDs = apiRef.current.getSelectedRows();
        setSelectedRows(Array.from(selectedIDs.keys()));
    };

    useEffect(() => {
        if (!data || !data.rows || !data.columns) {
            return <p>No data available</p>;
        }
        else {
            setIsDataLoaded(true);
            onProceed(true);
        }
        return () => {}; 
    }, [isDataLoaded, onProceed, data]);

    const columnsWithDeleteButton = cols.map((column) => ({
        ...column,
        renderHeader: () => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {column.headerName}
                {column.field !== 'id' && (
                    <IconButton
                    aria-label={`Delete`}
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteColumn(column.field)
                    }}
                >
                    <GridDeleteIcon fontSize="small" />
                </IconButton>
                )}
            </div>
        )
    }));

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbar/>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSelected();
                    }}
                    disabled={selectedRows.length === 0}
                    style={{ marginLeft: 8 }}
                >
                    Delete rows
                </Button>
            </GridToolbarContainer>
        )
    }

    if(isDataLoaded) {
        return (
            <Box sx={{ height: 500, width: '100%' }}>
                <h2>Your file</h2>
                <DataGrid
                    key={rows.length}
                    rows={rows}
                    columns={columnsWithDeleteButton}
                    loading={!rows.length}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    //density='compact'
                    showCellVerticalBorder = {true}
                    showColumnVerticalBorder = {true}
                    checkboxSelection
                    apiRef={apiRef}
                    onStateChange={handleStateChange}
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
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeleteSelected}
                    disabled={selectedRows.length === 0}
                    style={{ marginBottom: 10 }}
                >
                    Delete selected
                </Button>
            </Box>
        )
    }
    }

    

export default DataTable;