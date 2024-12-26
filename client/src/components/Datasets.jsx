import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Button, Box,  Chip, Alert } from '@mui/material';

const Datasets = ({ selectedDataset, setSelectedDataset, data, setData, onProceed, setColumnTypes, setTarget }) => {
  const [temporarySelectedDataset, setTemporarySelectedDataset] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const datasets = [
      { id: "iris", name: "Iris Dataset" },
      { id: "digits", name: "Digits Dataset" },
      { id: "wine", name: "Wine Dataset" },
      { id: "breast_cancer", name: "Breast Cancer Dataset" },
      { id: "california_housing", name: "California Housing Dataset" },
      { id: "diabetes", name: "Diabetes Dataset" },
    ];

  const resetState = () => {
    setSelectedDataset(null);
    setData(null);
    setColumnTypes(null);
    setTarget('')
    onProceed(false);
  };

  const handleTemporarySelect = (datasetId) => {
    setTemporarySelectedDataset(datasetId);
  };

  const handleSelect = async () => {
    console.log("Selected dataset:", temporarySelectedDataset);
    setSelectedDataset(temporarySelectedDataset);
    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`http://localhost:5000/data/load_dataset/${temporarySelectedDataset}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
      });
        if (!response.ok) {
            throw new Error(`Failed to fetch dataset: ${response.statusText}`);
        }

        const responseData = await response.json();

        const data = responseData.data;
        const columnTypes = responseData.types;
        const target = responseData.target;

        const keys = Object.keys(data[0]);

        const orderedKeys = keys.includes('id') 
        ? ['id', ...keys.filter((key) => key !== 'id')] 
        : keys;

        const cols = orderedKeys.map((key) => ({
          field: key,
          headerName: key.toUpperCase(),
          width: 150,
        }));

        const updatedColumnTypesRows = columnTypes.map(({ column, type }) => ({
          column: column.toUpperCase(),
          type: type,
        }));

        const updatedCols = cols.map((item, index) => ({
          ...item,
          type: columnTypes[index].type,
          class: columnTypes[index].class,
          nullCount: columnTypes[index].nullCount,
          uniqueValues: columnTypes[index].uniqueValues
        }))

        console.log(responseData);
        setTarget(target);
        setColumnTypes(updatedColumnTypesRows);
        setData({ rows: data, columns: updatedCols });
        onProceed(true);

    } catch (err) {
        console.error("Error fetching dataset:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleClear = () => {
      resetState();
  };

  return (
    <Box>
      {data && !selectedDataset && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          A file with your data has already been uploaded. To select a dataset, please remove the uploaded file first.
        </Alert>
      )}
      <Box
        sx={{
          maxHeight: 200,
          overflowY: "auto",
          border: "1px solid #ccc",
        }}
      >
        <List>
          {datasets.map((dataset) => (
            <ListItemButton
              key={dataset.id}
              disabled={Boolean(!!data && !selectedDataset)} // Disable if data exists and no selectedDataset
              selected={temporarySelectedDataset === dataset.id}
              onClick={() => handleTemporarySelect(dataset.id)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(63, 189, 189, 0.1)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(63, 189, 189, 0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(63, 189, 189, 0.4)",
                  },
                },
                "&.Mui-selected .MuiListItemText-primary": {
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemText primary={dataset.name} />
              {selectedDataset === dataset.id && (
                <Chip
                  label="Selected"
                  size="small"
                  sx={{
                    backgroundColor: "#3FBDBD",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={Boolean(!temporarySelectedDataset || selectedDataset)}
          onClick={handleSelect}
        >
          CONFIRM
        </Button>
        <Button
          variant={selectedDataset ? "outlined" : "contained"}
          color="error"
          disabled={Boolean(!selectedDataset)}
          onClick={handleClear}
        >
          CLEAR
        </Button>
      </Box>
    </Box>
  );
}

export default Datasets