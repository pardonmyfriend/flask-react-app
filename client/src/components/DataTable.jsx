import React, { useEffect, useState, useRef } from "react";
import { DataGrid, GridDeleteIcon, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { Box, Button, IconButton, AppBar, Tabs, Tab } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreprocessingDialog from "./PreprocessingDialog";
import TabPanel from "./TabPanel";
import ConfirmDialog from "./ConfirmDialog";

const DataTable = ({ data, onProceed, onOpen }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const defaultCols = useRef(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);

  useEffect(() => {
    console.log("Loaded data:", data);
    if (data && data.rows) {
      setRows((prev) => (prev.length === 0 ? data.rows : prev));
    }
    if (data && data.columns) {
      console.log(data.columns);
      const updatedColumns = data.columns.map((col) => ({
        ...col,
        width: Math.max(col.headerName.length * 20, 200),
      }));
      setCols((prev) => (prev.length === 0 ? updatedColumns : prev));

      if (!defaultCols.current) {
        defaultCols.current = JSON.parse(JSON.stringify(updatedColumns));
        console.log("Default columns set (deep copy):", defaultCols.current);
      }
    }
    console.log("Columns set to:", data.columns);
    console.log("Rows set to:", data.rows);
    console.log("Default cols: ", defaultCols.current);
    console.log("labada");
  }, [data]);

  const apiRef = useGridApiRef();
  const dialogRef = useRef(null);

  const updateIds = (data) => {
    return data.map((row, index) => ({ ...row, id: index + 1 }));
  };

  const handleDeleteSelected = () => {
    if (rows.length - selectedRows.length >= 10) {
      setRows((prevRows) => {
        const updatedRows = prevRows.filter(
          (row) => !selectedRows.includes(row.id)
        );
        console.log(updatedRows);
        return updateIds(updatedRows);
      });
    } else {
      toast.error("Minimum number of rows: 10", {
        progressStyle: {
          background: "#3fbdbd",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          //backgroundColor: "#ff5733",
        },
      });
    }
  };

  const handleConfirmDialogAnswer = (answer) => {
    if (answer === "Yes") {
      console.log("column to delete: ", columnToDelete);
      const newColumns = cols.filter(
        (column) => column.field !== columnToDelete
      );
      console.log(newColumns);
      setCols(newColumns);
      return newColumns;
    }
  };

  const handleDeleteColumn = (field) => {
    if (cols.length - 1 >= 2) {
      setColumnToDelete(field);
      setOpenConfirmDialog(true);
    } else {
      toast.error("Minimum number of columns: 2", {
        progressStyle: {
          background: "#3fbdbd",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          //backgroundColor: "#ff5733",
        },
      });
    }
  };

  const handleStateChange = () => {
    const selectedIDs = apiRef.current.getSelectedRows();
    const newSelectedRows = Array.from(selectedIDs.keys()); // Tworzy tablicę kluczy zaznaczonych wierszy.

    if (JSON.stringify(newSelectedRows) !== JSON.stringify(selectedRows)) {
      setSelectedRows(newSelectedRows); // Jeśli wartości są różne, aktualizuje stan.
    }
  };

  useEffect(() => {
    if (!data || !data.rows || !data.columns) {
      return <p>No data available</p>;
    } else {
      setIsDataLoaded(true);
      onProceed(true);
    }
    return () => {};
  }, [isDataLoaded, onProceed, data]);

  const columnsWithDeleteButton = cols.map((column) => ({
    ...column,
    renderHeader: () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {column.headerName}
        {column.field !== "id" && (
          <IconButton
            aria-label={`Delete`}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteColumn(column.field);
            }}
          >
            <GridDeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    ),
  }));

  const handleCloseDialog = () => {
    console.log("default: ", defaultCols.current);
    console.log("after changes: ", cols);
    const defaultTypes = defaultCols.current;
    const hasChangedFromNumerical = defaultCols.current.some((col, index) => {
      const currentType = cols[index]?.type; // Typ w aktualnej kolumnie
      const defaultType = col.type; // Typ w kolumnie domyślnej

      return (
        (defaultType === "nominal" || defaultType === "categorical") &&
        currentType === "numerical"
      );
    });
    console.log("hasChangedFromNumerical: ", hasChangedFromNumerical);
    setOpen(false); // Zamykanie dialogu
    if (hasChangedFromNumerical) {
      console.log("jestem w ifie");
      toast.info("Label encoding in progress...", {
        progressStyle: {
          background: "#3fbdbd",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          //backgroundColor: "#ff5733",
        },
      })}

    fetch("http://127.0.0.1:5000/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cols, defaultTypes }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Rozwiąż JSON
      })
      .then((result) => {
        console.log("Fetched data:", result);
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  };

  const handleSelectColumnChange = (event, index) => {
    console.log("cols:", cols); // Sprawdź, jaka jest zawartość cols
    console.log("index:", index);
    console.log("event", event); // Sprawdź, jaki indeks jest przekazywany

    const newCols = [...cols]; // Tworzymy nową kopię tablicy wierszy

    newCols[index].type = event.target.value; // Zmieniamy pole 'type' na wybraną opcję

    if (newCols[index].class === "true") {
      if (event.target.value !== "categorical") {
        newCols[index].class = "false"; // Odznacz, jeśli zmieniasz typ na inny niż categorical
        setSelectedColumn(null); // Resetuj wybraną kolumnę
      }
    }

    setCols(newCols); // Ustawiamy stan
    console.log("newCols: ", newCols);
  };

  const onHandleNullValuesChange = (event, index) => {
    console.log("index:", index);
    const newCols = [...cols]; // Tworzymy nową kopię tablicy wierszy
    console.log("old handle null value: ", newCols[index+1].handleNullValues);
    newCols[index+1].handleNullValues = event.target.value; // Zmieniamy pole 'type' na wybraną opcję
    console.log("new handle null value: ", event.target.value);
    setCols(newCols); // Ustawiamy stan
    console.log("newCols: ", newCols);
  };

  const onValueToFillWithChange = (value, index) => {
    console.log("index:", index);
    const newCols = [...cols]; // Tworzymy nową kopię tablicy wierszy
    console.log("old value to fill with: ", newCols[index+1].valueToFillWith);
    newCols[index+1].valueToFillWith = value; // Zmieniamy pole 'type' na wybraną opcję
    console.log("new value to fill with: ", value);
    setCols(newCols); // Ustawiamy stan
    console.log("newCols: ", newCols);
  };

  const handleCheckboxChange = (event, columnId) => {
    console.log("columnId:", columnId);

    const isChecked = event.target.checked; // Sprawdzamy, czy checkbox jest zaznaczony

    setSelectedColumn(isChecked ? columnId : null); // Ustawiamy selectedColumn tylko, gdy checkbox jest zaznaczony

    const newCols = [...cols]; // Tworzymy nową kopię tablicy wierszy

    if (isChecked) {
      // Jeśli checkbox jest zaznaczony:
      newCols[columnId].type = "categorical";
      newCols[columnId].class = "true";
      // Odznaczamy wszystkie inne kolumny
      newCols.forEach((col, index) => {
        if (index !== columnId) {
          col.class = "false";
        }
      });
    } else {
      // Jeśli checkbox jest odznaczony:
      newCols[columnId].class = "false"; // Odznaczamy checkbox dla columnId
    }
    setCols(newCols); // Ustawiamy stan
  };

  const setColsTypesDefaultValues = () => {
    console.log("default cols 1:", defaultCols.current);
    setCols(JSON.parse(JSON.stringify(defaultCols.current)));
    setSelectedColumn(null);
  };

  if (isDataLoaded) {
    return (
      <Box sx={{ height: 500, width: "100%" }}>
        <AppBar position="static" sx={{ borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)} // Obsługa zmiany zakładki
            indicatorColor="inherit"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Data" />
            <Tab label="Summary" />
          </Tabs>
        </AppBar>

        <TabPanel value={activeTab} index={0}>
          <ToastContainer position="top-right" autoClose={3000} />
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            Your file
            <Button
              variant="contained"
              style={{ marginBottom: 10, position: "absolute", right: 190 }}
              sx={{
                backgroundColor: "#3fbdbd",
                color: "black",
              }}
            >
              Normalize
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteSelected}
              disabled={selectedRows.length === 0}
              style={{ marginBottom: 10, position: "absolute", right: 0 }}
              sx={{
                backgroundColor: "#3fbdbd",
                color: "black",
              }}
            >
              Delete selected
            </Button>
          </h2>


          <DataGrid
            key={rows.length}
            rows={rows}
            columns={columnsWithDeleteButton}
            loading={!rows.length}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            showCellVerticalBorder={true}
            showColumnVerticalBorder={true}
            disableColumnResize
            checkboxSelection
            apiRef={apiRef}
            onStateChange={handleStateChange}
            sx={{
              height: 400,
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                fontSize: "17px",
              },
              "& .MuiDataGrid-row:nth-of-type(2n)": {
                backgroundColor: "    #f6f6f6  ",
              },
              "& .MuiDataGrid-toolbar": {
                color: "white", // Dodatkowe ustawienia dla kolorów w DataGrid
              },
              "& .MuiButton-textPrimary": {
                color: "white !important",
              },
              "& .MuiTypography-root": {
                color: "white !important", // Ustaw kolor tekstu na biały dla typografii
              },
              "& .MuiButtonBase-root": {
                color: "white !important", // Ustaw kolor tekstu na biały dla przycisków
              },
              "& .MuiSvgIcon-root": {
                color: "  #3fbdbd !important",
              },
              "& .MuiDataGrid-columnsManagement": {
                backgroundColor: "  #3fbdbd !important",
              },
              "& .MuiDataGrid-iconButtonContainer": {
                marginLeft: "8px", // Dystans między nazwą a ikoną
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                sx: {
                  backgroundColor: "   #474747", // Przykładowy kolor tła
                  fontWeight: "bold", // Pogrubienie tekstu
                  padding: "10px", // Dodatkowe odstępy
                  fontSize: "30px",
                  color: " #ffffff",
                  "& .MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-colorPrimary MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-colorPrimary css-8iab9z-MuiButtonBase-root-MuiButton-root":
                    {
                      // Stylizacja typografii w toolbarze
                      color: "white", // Ustaw kolor tekstu na biały
                    },
                },
              },
            }}
          />
        </TabPanel>
        <PreprocessingDialog
          open={open}
          onClose={handleCloseDialog}
          selectedOption={selectedColumn}
          setSelectedOption={setSelectedColumn}
          onSelectChange={handleSelectColumnChange}
          onHandleNullValuesChange={onHandleNullValuesChange}
          onValueToFillWithChange={onValueToFillWithChange}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          handleCheckboxChange={handleCheckboxChange}
          setColsTypesDefaultValues={setColsTypesDefaultValues}
          cols={cols.filter((col) => col.headerName !== "ID")}
          defaultCols={defaultCols.current}
        />

        <ConfirmDialog
          openConfirmDialog={openConfirmDialog}
          setOpenConfirmDialog={setOpenConfirmDialog}
          handleConfirmDialogAnswer={handleConfirmDialogAnswer}
          columnName={columnToDelete}
        />
      </Box>
    );
  }
};

export default DataTable;
