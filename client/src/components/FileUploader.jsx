import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUploader = ({ setData, onProceed }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);


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
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();  // Oczekujemy na odpowiedź serwera w formacie JSON
      console.log(responseData);  // Wyświetlenie odpowiedzi w konsoli
    
      const data = responseData;
      onProceed(true);
      console.log("onProceed invoked");

      if (data && data.length > 0) {
        const cols = Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.toUpperCase(),
          width: 150,
        }));

        const rows = data;

        setData({ rows, columns: cols });
        
      }
    
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
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
            m: 2,  
            mt: 4, 
            mb: 3, 
          }}
          variant="contained"
          component="span"
          onClick={sendFileToBackend}
          disabled={!file}
        >
          Upload
        </Button>
      </label>
    </>
  );
};

export default FileUploader;
