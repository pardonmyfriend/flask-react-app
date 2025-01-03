import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Fade from '@mui/material/Fade';
import { Alert } from '@mui/material';


const FileUploader = ({ file, setFile, data, setData, setColumnTypes, onProceed, setAlgTab, setAlgorithmName, setParams, setAlgorithmSelected, setColumnTypesAligned, columnTypesAligned }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessBox, setShowSuccessBox] = useState(false);

  useEffect(() => {
    if (file) {
      console.log('New file detected:', file);
      sendFileToBackend(file);
    }
  }, [file]);

  const resetState = () => {
    setData(null);
    setFile(null);
    setUploadProgress(0);
    setShowSuccessBox(false);
    setAlgTab(0);
    setAlgorithmName('');
    setParams({});
    setAlgorithmSelected(false);
    onProceed(false);
    setColumnTypesAligned(true)
  };

  const validateFileType = (file) => {
    const allowedExtensions = ['csv', 'xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Invalid file type. Please upload a CSV or Excel file.");
      resetState();
      return false;
    }
    return true;
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (file) return;

    console.log("ColumnTypesAligned", columnTypesAligned)
    console.log("SetColumnTypesAligned", setColumnTypesAligned)
    console.log("setAlgTab", setAlgTab)
    resetState();

    if (acceptedFiles.length) {
      const file = acceptedFiles[0];

      if (validateFileType(file)) {
        setFile(file);
      }
    }
  }, []);

  const handleButtonClick = (event) => {
    if (file) return;
    console.log("ColumnTypesAligned", columnTypesAligned)
    console.log("SetColumnTypesAligned", setColumnTypesAligned)
    console.log("setAlgTab", setAlgTab)
    resetState();

    const files = event.target.files;

    if (files.length) {
      const file = files[0];
      if (validateFileType(file)) {
        setFile(file);
      }
    }

    event.target.value = null;
  };

  const removeFile = () => {
    resetState();
    console.log("File removed")
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5242880,
    noClick: true,
    noDrag: !!file
  });

  const sendFileToBackend = (fileToSend) => {
    if (!fileToSend) {
      console.error("No file to send");
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToSend);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000/data/upload', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
  
        if (responseData.data && responseData.data.length > 0) {
          const data = responseData.data;
          console.log("data:", data);
          //const columnTypes = responseData.types;

          // Znalezienie nazwy kolumny, która ma target === true
          // const targetColumn = columnTypes.find((col) => col.target === "true")?.column;
          // console.log("TargeColumn:", targetColumn)

          const keys = Object.keys(data[0]);

          const orderedKeys = keys.includes('id') 
          ? ['id', ...keys.filter((key) => key !== 'id')] 
          : keys;

          //  // Sortowanie kluczy: target na końcu, 'id' jako pierwszy (jeśli istnieje)
          // const orderedKeys = [
          //   ...keys.filter((key) => key !== 'id' && key !== targetColumn), // Wszystkie oprócz 'id' i target
          //   'id', // 'id' jako pierwszy
          //   targetColumn, // target jako ostatni
          // ].filter(Boolean); // Usuwa undefined, gdy targetColumn jest pusty

          // const orderedKeys = targetColumn
          // ? [
          //     'id', // 'id' zawsze na początku
          //     ...keys.filter((key) => key !== 'id' && key !== targetColumn), // Pozostałe klucze bez 'id' i target
          //     targetColumn, // targetColumn na końcu
          //   ]
          // : [
          //     'id', // 'id' zawsze na początku
          //     ...keys.filter((key) => key !== 'id'), // Pozostałe klucze bez 'id'
          //   ];
          
          const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            width: 150,
          }));

          const columnTypes = responseData.types;
          const updatedColumnTypesRows = columnTypes.map(({ column, type }) => ({
            column: column.toUpperCase(),
            type: type,
          }));
          
          setColumnTypes(updatedColumnTypesRows);

          // Zaktualizuj cols - dopasowanie na podstawie nazw kolumn
          console.log("columnTypes", columnTypes)
          console.log("updatedColumnTypesRows", updatedColumnTypesRows)
          const updatedCols = cols.map((item) => {
            // Znajdź pasującą kolumnę w ColumnTypes
            const matchingColumnType = columnTypes.find(
              ({ column }) => column.toLowerCase() === item.field.toLowerCase()
            );
            console.log("matchingColumnType", matchingColumnType)
            console.log("matchingColumnType for", item.field, matchingColumnType);
            // Przypisz dane z matchingColumnType, jeśli istnieje
            return {
              ...item,
              type: matchingColumnType ? matchingColumnType.type : undefined,
              class: matchingColumnType ? matchingColumnType.class : undefined,
              nullCount: matchingColumnType ? matchingColumnType.nullCount : undefined,
              handleNullValues: matchingColumnType ? matchingColumnType.handleNullValues : undefined,
              uniqueValuesCount: matchingColumnType ? matchingColumnType.uniqueValuesCount : undefined,
              uniqueValues: matchingColumnType ? matchingColumnType.uniqueValues : undefined,
              valueToFillWith: matchingColumnType ? matchingColumnType.valueToFillWith : undefined,
            };
          });

          console.log("columns with types:", updatedCols);

          setUploadProgress(100);

          setTimeout(() => {
            setData({ rows: data, columns: updatedCols });
            setShowSuccessBox(true);
            onProceed(true);
          }, 1000);
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          toast.error(errorResponse.error, {
            progressStyle: { 
                background: "#3fbdbd",
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }});
            resetState();
          } catch (e) {
              console.error('Błąd parsowania odpowiedzi błędu:', e);
              resetState();
          }
        console.error('Błąd podczas przesyłania pliku');
        setUploadProgress(0);
        resetState();
      }
    };
  
    xhr.onerror = () => {
      toast.error("Error connecting to the server. Please try again later.");
      setUploadProgress(0);
      resetState();
    };
  
    xhr.send(formData);
  };

  return (
    <>
      {!file && !data && (
        <Alert 
          severity="info" 
          sx={{ marginBottom: '20px', borderRadius: '10px', padding: '10px' }}
        >
          Please ensure your file is properly formatted: the first row should contain column names, and subsequent rows should include values for each column. Avoid null values where possible. The analyses focus on numeric data, but encoding categorical values is supported. You can include a target column for classification tasks.
        </Alert>
      )}
      {data && !file && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          A dataset from the sample database has already been selected. To upload your own file, please remove the current selection first.
        </Alert>
      )}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
          marginBottom: "20px",
          cursor: "default",
        }}
      >
        <ToastContainer />
        <CloudUploadIcon
          sx={{ fontSize: 60, color: "#474747", marginBottom: "20px" }}
        />

        {/* <input {...getInputProps()} /> */}
        {isDragActive ? (
          <Typography variant="body1" sx={{ marginBottom: "16px" }}>Drop the file here...</Typography>
        ) : file ? (
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: "16px" }}>
            File already uploaded. Remove it to upload a new one.
          </Typography>
        ) : data ? (
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: "16px" }}>
            File uploading not available.
          </Typography>
        ) : (
          <>
            <Typography variant="body1" sx={{ marginBottom: "12px" }}>
              Drag & Drop a CSV or Excel file here, or click to select one.
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: "16px" }}>
              OR
            </Typography>
          </>
        )}

        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleButtonClick}
          style={{ display: "none" }}
          id="fileInput"
          disabled={!!data}
        />

        <label htmlFor="fileInput">
          <Button color="primary" variant="contained" component="span" disabled={!!data}>
            Browse file
          </Button>
        </label>
      </Box>

      {file && (
        showSuccessBox || data ? (
          <Fade in={showSuccessBox} timeout={1000}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(63, 189, 189, 0.3)",
                border: "1px solid #3FBDBD",
                borderRadius: "8px",
                padding: "10px 15px",
                marginBottom: "10px",
              }}
            >
              <CheckCircleIcon sx={{ color: "#3FBDBD", marginRight: "10px" }} />
              <Stack direction="row" alignItems="center" flexGrow={1}>
                <Typography variant="body1">{file.name}</Typography>
                <Typography variant="body2" sx={{ marginLeft: "auto" }}>
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Stack>
              <IconButton onClick={removeFile} sx={{ marginLeft: "10px", color: '#474747' }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Fade>
        ) : (
          <Box mt={2} sx={{ width: "100%" }}>
            <Typography variant="body2">{file.name}</Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ mt: 2 }}
            />
          </Box>
        )
      )}
    </>
  );
};

export default FileUploader;
