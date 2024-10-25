import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

function DataTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/data/iris', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(resp => resp.json())
        .then(resp => setData(JSON.parse(resp)))
        .catch(error => console.log('Error fetching data:', error));
    }, []);

    const columns = [
        { field: 'sepal length (cm)', headerName: 'Sepal Length', width: 150 },
        { field: 'sepal width (cm)', headerName: 'Sepal Width', width: 150 },
        { field: 'petal length (cm)', headerName: 'Petal Length', width: 150 },
        { field: 'petal width (cm)', headerName: 'Petal Width', width: 150 },
        { field: 'target', headerName: 'Target', width: 100 },
      ];

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <h2>Iris Dataset</h2>
            <DataGrid
                rows={data.map((row, index) => ({ id: index, ...row }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
            />
        </Box>
    )
}

export default DataTable