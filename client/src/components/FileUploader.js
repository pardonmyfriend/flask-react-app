import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import DataTable from './DataTable';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      simulateFileUpload();
    }
  }, []);

  const handleButtonClick = (event) => {
    const files = event.target.files;
    if (files.length) {
      setFile(files[0]);
      simulateFileUpload();
    }
  };

  const simulateFileUpload = () => {
    const interval = setInterval(() => {
      setUploadProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 500);
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    console.log("removed")
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: '.csv, .xlsx',
    maxFiles: 1,
    maxSize: 5242880,
    noClick: true,
  });

  const sendFileToBackend = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Wysyłanie pliku na backend
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);

      const data = response.data;

      if (data && data.length > 0) {
        const cols = Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.toUpperCase(),
          width: 150,
        }));

        setColumns(cols);  // Ustawienie kolumn
        setRows(data);     // Ustawienie wierszy
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
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

      <label htmlFor="fileUpload">
        <Button
          sx={{
            m: 2,  // ogólny margines z każdej strony
            mt: 4, // margines górny
            mb: 3, // margines dolny
          }}
          variant="contained"
          component="span"
          onClick={sendFileToBackend}
        >
          Upload
        </Button>
      </label>

      {rows.length > 0 && columns.length > 0 ? (
        <DataTable rows={rows} columns={columns} />
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

export default FileUploader;
