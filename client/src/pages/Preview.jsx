import React, { useEffect, useState, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Preview = ({ data, columnTypes, onProceed }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
  }, [data, columnTypes]);

  useEffect(() => {
    if (!data || !data.rows || !data.columns) {
      return <p>No data available</p>;
    } else {
      setIsDataLoaded(true);
      onProceed(true);
    }
    return () => {};
  }, [isDataLoaded, onProceed, data]);

  if (isDataLoaded) {
    return (
      <Box>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          Preview
        </h1>
        <DataGrid
          key={rows.length}
          rows={rows}
          columns={cols}
          loading={!rows.length}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            }}
          pageSizeOptions={[10, 25, 50]}
          showCellVerticalBorder={true}
          showColumnVerticalBorder={true}
          disableColumnResize
          sx={{
            height: 700,
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

export default Preview;
