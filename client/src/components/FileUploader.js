import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUploader = () => {
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
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: '.csv, .xlsx',
    maxFiles: 1,
    maxSize: 5242880,
    noClick: true,
  });

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        File upload
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f0f0' : '#fff',
          marginBottom: '20px',
          cursor: 'default',
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 60, color: '#1976d2', marginBottom: '20px' }} />

        {/* <input {...getInputProps()} /> */}
        {isDragActive ? (
          <Typography variant="body1">Drop the file here...</Typography>
        ) : (
          <>
            <Typography variant="body1">
              Drag & Drop a CSV or Excel file here, or click to select one.
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: '16px' }}>
              OR
            </Typography>
          </>
        )}


        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleButtonClick}
          style={{ display: 'none' }}
          id="fileInput"
        />

        <label htmlFor="fileInput">
          <Button
            variant='contained'
            component="span"
          >
            Browse files
          </Button>
        </label>
      </Box>

      {file && (
        <Box mt={2} sx={{ width: '100%' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">{file.name}</Typography>
            <Typography variant="body2">{(file.size / 1024).toFixed(2)} KB</Typography>
            <IconButton onClick={removeFile}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />
        </Box>
      )}
    </>
  );
};

export default FileUploader;
