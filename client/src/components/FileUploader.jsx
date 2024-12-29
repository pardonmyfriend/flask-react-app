import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Fade from '@mui/material/Fade';


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
          const keys = Object.keys(data[0]);

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
            column: column.toUpperCase(),
            type: type,
          }));
          
          setColumnTypes(updatedColumnTypesRows);

          const updatedCols = cols.map((item, index) => ({
            ...item,
            type: columnTypes[index].type,
            class: columnTypes[index].class,
            nullCount: columnTypes[index].nullCount,
            handleNullValues: columnTypes[index].handleNullValues,
            uniqueValuesCount: columnTypes[index].uniqueValuesCount,
            uniqueValues: columnTypes[index].uniqueValues,
            valueToFillWith: columnTypes[index].valueToFillWith
          }))
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
          } catch (e) {
              console.error('Błąd parsowania odpowiedzi błędu:', e);
          }
        console.error('Błąd podczas przesyłania pliku');
        setUploadProgress(0);
      }
    };
  
    xhr.onerror = () => {
      toast.error("Error connecting to the server. Please try again later.");
      setUploadProgress(0);
    };
  
    xhr.send(formData);
  };

  return (
    <>
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
            You have already selected a dataset. Please deselect it to upload your file.
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
