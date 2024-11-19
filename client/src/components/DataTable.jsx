import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridDeleteIcon,
  GridToolbar,
  GridToolbarContainer,
  useGridApiRef
} from "@mui/x-data-grid";
import { Box, Button, IconButton, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreprocessingDialog from "./PreprocessingDialog";

const DataTable = ({ data, onProceed, onOpen }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentView, setCurrentView] = useState(1);

  useEffect(() => {
    console.log("Loaded data:", data);
    if (data && data.rows) {
      setRows(data.rows);
    }
    if (data && data.columns) {
      console.log(data.columns);
      const updatedColumns = data.columns.map((col) => ({
        ...col,
        width: Math.max(col.headerName.length * 20, 200),
      }));
      setCols(updatedColumns);
    }
    console.log("Columns set to:", data.columns);
    console.log("Rows set to:", data.rows);
  }, [data]);

  const apiRef = useGridApiRef();

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
      //alert("Minimum number of rows: 10");
      toast.error("Minimum number of rows: 10", {
        progressStyle: {
          background: "#3fbdbd",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          //backgroundColor: "#ff5733",
        },
      });
    }
  };

  const handleDeleteColumn = (field) => {
    if (cols.length - 1 >= 2) {
      const newColumns = cols.filter((column) => column.field !== field);
      console.log(newColumns);
      setCols(newColumns);
      return newColumns;
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
    setSelectedRows(Array.from(selectedIDs.keys()));
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

  const handleOpenDialog = () => {
    setOpen(true); // Otwieramy dialog
  };

  const handleCloseDialog = () => {
    setOpen(false); // Zamykanie dialogu
  };

  const handleSelectColumnChange = (event) => {
    setSelectedColumn(event.target.value); // Ustawiamy wybraną wartość w rozwijanej liście
  };


  if (isDataLoaded) {
    return (
      <Box sx={{ height: 500, width: "100%" }}>
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
          {/* <Button
            variant="contained"
            onClick={handleOpenDialog}
            style={{ marginBottom: 10, position: "absolute", right: 190 }}
            sx={{
              backgroundColor: "#3fbdbd",
              color: "black",
            }}
          >
            Preprocessing
          </Button> */}
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
        <PreprocessingDialog
          open={open}
          onClose={handleCloseDialog}
          selectedOption={selectedColumn}
          onSelectChange={handleSelectColumnChange}
          cols={cols.filter((col) => col.headerName !== "ID")}
        />
        <DataGrid
          key={rows.length}
          rows={rows}
          columns={columnsWithDeleteButton}
          loading={!rows.length}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          //density='compact'
          showCellVerticalBorder={true}
          showColumnVerticalBorder={true}
          disableColumnResize
          checkboxSelection
          apiRef={apiRef}
          onStateChange={handleStateChange}
          sx={{
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
      </Box>
    );
  }

};

export default DataTable;
