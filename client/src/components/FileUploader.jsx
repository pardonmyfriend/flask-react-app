import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


const FileUploader = ({ setData, setColumnTypes, onProceed }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      console.log(fileExtension)

      if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFile(file);
        sendFileToBackend(file);
      } else {
        console.warn("Incorrect file extension.");
      }
    }
  }, []);

  const handleButtonClick = (event) => {
    const files = event.target.files;
    if (files.length) {
      setFile(files[0]);
      sendFileToBackend(files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    console.log("removed")
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5242880,
    noClick: true,
  });

  const sendFileToBackend = (fileToSend) => {
    if (!fileToSend) {
      console.error("No file to send");
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToSend);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000/upload', true);

    // Ustawienie zdarzenia `onprogress`, aby śledzić postęp przesyłania
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete); // Aktualizuje pasek postępu
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        console.log(responseData);
        
        onProceed(true);
        console.log("onProceed invoked");
  
        if (responseData.data && responseData.data.length > 0) {
          const data = responseData.data;
          console.log("data:", data);
          const keys = Object.keys(data[0]);

          // Przenieś kolumnę `id` na początek, jeśli istnieje
          const orderedKeys = keys.includes('id') 
          ? ['id', ...keys.filter((key) => key !== 'id')] 
          : keys;
          
          const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            width: 150,
          }));

          const columnTypes = responseData.types;
          const updatedColumnTypesRows = columnTypes.map(({ column, type }) => ({
            column: column.toUpperCase(), // Zmieniamy nazwę kolumny na wielkie litery
            type: type,                  // Zachowujemy typ bez zmian
          }));
          
          setColumnTypes(updatedColumnTypesRows);
          console.log("column types:", columnTypes);

          const updatedCols = cols.map((item, index) => ({
            ...item,
            type: columnTypes[index].type
          }))

          setData({ rows: data, columns: updatedCols });
        }
        setUploadProgress(100); // Ustawia postęp na 100% po zakończeniu
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          toast.error(errorResponse.error, {
            progressStyle: { 
                background: "#3fbdbd",
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                //backgroundColor: "#ff5733",
            }});
          } catch (e) {
              console.error('Błąd parsowania odpowiedzi błędu:', e);
          }
        console.error('Błąd podczas przesyłania pliku');
        // toast.error('Błąd podczas przesyłania pliku', {
        //   progressStyle: { 
        //       background: "#3fbdbd",
        //       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        //       //backgroundColor: "#ff5733",
        //   }});
        setUploadProgress(0);
      }
    };
  
    // Obsługa błędów
    xhr.onerror = () => {
      console.error('Wystąpił błąd podczas połączenia z serwerem');
      setUploadProgress(0);
    };
  
    // Wysłanie pliku
    xhr.send(formData);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        File upload
      </Typography>

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
          sx={{ fontSize: 60, color: "#1976d2", marginBottom: "20px" }}
        />

        {/* <input {...getInputProps()} /> */}
        {isDragActive ? (
          <Typography variant="body1">Drop the file here...</Typography>
        ) : (
          <>
            <Typography variant="body1">
              Drag & Drop a CSV or Excel file here, or click to select one.
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: "16px" }}>
              OR
            </Typography>
          </>
        )}

        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleButtonClick}
          style={{ display: "none" }}
          id="fileInput"
        />

        <label htmlFor="fileInput">
          <Button variant="contained" component="span">
            Browse files
          </Button>
        </label>
      </Box>

      {file && (
        <Box mt={2} sx={{ width: "100%" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">{file.name}</Typography>
            <Typography variant="body2">
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
            <IconButton onClick={removeFile}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ mt: 2 }}
          />
        </Box>
      )}
    </>
  );
};

export default FileUploader;
