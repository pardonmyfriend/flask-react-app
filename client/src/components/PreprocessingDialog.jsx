import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, FormControl, InputLabel, Checkbox,
  Box, Typography, Tooltip, IconButton
 } from '@mui/material';
import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TextField from '@mui/material/TextField';
import NumericInput from './NumericInput';

function PreprocessingDialog({ open, onClose, selectedOption, onSelectChange, cols, handleCheckboxChange, setColsTypesDefaultValues, defaultCols, onHandleNullValuesChange, onValueToFillWithChange }) {
    const colTypes = ['numerical', 'nominal', 'categorical'];

  return (
    <div style={{ position: 'relative' }}>
      <Dialog open={open} 
      onClose={(e, reason) => {
        // Zablokowanie zamknięcia dialogu przez kliknięcie poza nim
        if (reason === 'backdropClick') {
          e.stopPropagation();
        }
      }}
      aria-hidden={!open} maxWidth="lg" // Możesz dostosować maksymalną szerokość
        fullWidth
        disableEscapeKeyDown
        >
        <DialogTitle sx={{ textAlign: 'center' }}>{"Align column types and handle null values"}
        </DialogTitle>
        <DialogContent>

        <div>
        <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              '@media (max-width: 600px)': {
                flexDirection: 'column',  // Ustawienie kolumnowego układu dla małych ekranów
              }
            }}>
            <Box sx={{
                    flex: '1 1 45%',
                    border: '1px solid #ccc',
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex', // Ustawienie układu w poziomie
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', // Zapobiega zawijaniu w przypadku braku miejsca
            }}>
            <Typography variant="body1" sx={{ minWidth: '100px', marginRight: '8px', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: '5px' }}>Column name</Typography>
            <Typography variant="body1" sx={{ minWidth: '100px', marginRight: '8px', display: 'flex', alignItems: 'center', marginLeft: '10px', fontWeight: 'bold' }}>Default type</Typography>
            <Typography variant="body1" sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Current type</Typography>
            <Typography variant="body1" sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Target
            <Tooltip title={<>The column in your dataset <br /> that you want to predict.<br />Target must be categorical.</>} arrow>
            <IconButton size="small" sx={{ padding: 0 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            </Tooltip>
            </Typography>
            </Box>

            <Box 
            sx={{
              flex: '1 1 40%',
              border: '1px solid #ccc',
              padding: 2,
              borderRadius: 2,
              display: 'flex', // Ustawienie układu w poziomie
              justifyContent: 'space-between',
              flexWrap: 'wrap', // Zapobiega zawijaniu w przypadku braku miejsca
            }}
            >
            <Typography variant="body1" sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Null values
            <Tooltip title={<>The number of null values <br />in the column.</>} arrow>
            <IconButton size="small" sx={{ padding: 0 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            </Tooltip>
            </Typography>
            <Typography variant="body1" sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: 'auto' }}>Handle null values
            <Tooltip title={<>Choose a way <br/>to handle null values.</>} arrow>
            <IconButton size="small" sx={{ padding: 0 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            </Tooltip>
            </Typography>
            <Typography variant="body1" sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: 'auto' }}>Fill with value
            <Tooltip title={<>Enter the value <br /> to fill null values with.</>} arrow>
            <IconButton size="small" sx={{ padding: 0 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            </Tooltip>
            </Typography>
            </Box>
        </Box>

          {cols.map((col, index) => (
            <Box 
            key={index}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              '@media (max-width: 600px)': {
                flexDirection: 'column',  // Ustawienie kolumnowego układu dla małych ekranów
              }
            }}>

              <Box key={index+100} 
              sx={{
                flex: '1 1 45%',
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
                display: 'flex', // Ustawienie układu w poziomie
                justifyContent: 'space-between',
                flexWrap: 'wrap', // Zapobiega zawijaniu w przypadku braku miejsca
              }}
              >
              {/* Typography po lewej */}
              <Typography variant="body1" sx={{ minWidth: '150px', marginRight: '8px', display: 'flex', alignItems: 'center', maxWidth: '150px' }}>{col.headerName}</Typography>
              <Typography variant="body1" sx={{ minWidth: '100px', marginRight: '8px', marginLeft: '5px', display: 'flex', alignItems: 'center' }}>{defaultCols[index+1]?.type}</Typography>
              {/* Select po prawej */}
              <FormControl>
                <InputLabel id="select-label">Type</InputLabel>
                <Select
                  labelId={`select-${index}-label`}
                  id={`select-${index}`}
                  value={cols[index].type}
                  label="Opcja"
                  onChange={(event) => onSelectChange(event, index+1)}
                  autoWidth={true}
                  sx={{ minWidth: '130px', marginRight: '8px', display: 'flex', alignItems: 'center' }}
                >
                  {colTypes
                  .filter((colType) => !(colType === 'categorical' && cols[index].uniqueValuesCount === 0)) // Filtr warunku
                  .map((colType, colIndex) => (
                    <MenuItem key={colIndex} value={colType}>
                      {colType}
                    </MenuItem>
                  ))}
              </Select>
              </FormControl>
              {cols[index].uniqueValuesCount !== 0 ? (
                <Checkbox
                  checked={selectedOption === index + 1}
                  onChange={(event) => handleCheckboxChange(event, index + 1)}
                  color="primary"
                  sx={{ width: '80px' }}
                />
              ) : (
                <Box sx={{ width: '80px', height: '40px' }} /> // Rozmiar odpowiadający checkboxowi
              )}
            </Box>

            <Box key={index+10} 
              sx={{
                flex: '1 1 40%',
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
                display: 'flex', // Ustawienie układu w poziomie
                justifyContent: 'space-between',
                flexWrap: 'wrap', // Zapobiega zawijaniu w przypadku braku miejsca
              }}
              >
              {/* Typography po lewej */}
              <Typography variant="body1" sx={{ minWidth: '80px',  display: 'flex', alignItems: 'center', marginLeft: '10px' }}>{col.nullCount}</Typography>
              {/* Select po prawej */}
              {col.nullCount !== 0 && (
                <>
              <FormControl>
              <InputLabel id="additional-select-label">Handle Null</InputLabel>
              <Select
                labelId={`additional-select-${index}-label`}
                id={`additional-select-${index}`}
                value={cols[index].handleNullValues || ''}
                label="Handle Null"
                onChange={(event) => onHandleNullValuesChange(event, index)}
                autoWidth={true}
                sx={{
                  minWidth: '180px',
                  marginRight: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '180px',
                }}
              >
                {/* Opcje radzenia sobie z nullami */}
                <MenuItem key={index+20} value="Ignore">Ignore</MenuItem>
                <MenuItem key={index+21} value="Drop rows">Drop rows</MenuItem>
                <MenuItem key={index+22} value="Drop column">Drop column</MenuItem>
                <MenuItem key={index+23} value="Fill with average value">Fill with average value</MenuItem>
                <MenuItem key={index+24} value="Fill with median">Fill with median</MenuItem>
                <MenuItem key={index+25} value="Fill with specific value">Fill with specific value</MenuItem>
              </Select>
            </FormControl>

            {col.handleNullValues === "Fill with specific value" ? (
              col.type === "numerical" ? (
                // NumericInput (dla typu "a")
                <NumericInput
                  min={0}
                  max={100}
                  defaultValue={0}
                  step={1}
                  precision={0}
                  onChange={(value) => onValueToFillWithChange(value, index)}
                />
              ) : col.type === "nominal" ? (
                // TextField (dla typu "b")
                <TextField 
                  label="Text Input"
                  variant="outlined"
                  sx={{
                    minWidth: '80px',
                    marginRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '120px',
                  }}
                  onChange={(value) => onValueToFillWithChange(value, index)}
                />
              ) : col.type === "categorical" ? (
                // Select (dla typu "c")
                <FormControl>
                <InputLabel id={`select-${index}-label`}>Value</InputLabel>
                <Select
                  labelId={`select-${index}-label`}
                  id={`select-${index}`}
                  value={cols[index].valueToFillWith} // Możesz dostosować domyślną wartość
                  label="Opcja"
                  autoWidth={true}
                  sx={{
                    minWidth: '130px',
                    marginRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onChange={(value) => onValueToFillWithChange(value, index)}
                  //onChange={(event) => onSelectChange(event, index)} // Dostosuj funkcję zmiany
                >
                  {/* Iterowanie po uniqueValues dla konkretnej kolumny */}
                  {cols[index].uniqueValues.map((uniqueValue, uniqueIndex) => (
                    <MenuItem key={uniqueIndex} value={uniqueValue}>
                      {uniqueValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              ) : (
                // Domyślny komponent (jeśli typ nie pasuje)
                <Box sx={{ width: '130px', height: '40px' }} />
              )
            ) : (
              // Warunek, gdy handleNullValues nie jest "Fill with specific value"
              <Box sx={{ width: '130px', height: '40px' }} />
            )}
              </>)}
            </Box>
            </Box>
          ))}
        </div>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: "space-between", // Rozstaw przyciski
          padding: "16px", // Opcjonalne dostosowanie odstępów
        }}>
          <Button 
          variant="contained"
          onClick={setColsTypesDefaultValues}
          sx={{
            backgroundColor: "#3fbdbd",
            color: "black",
            minWidth: "180px"
          }}>Set default types</Button>
          <Button
          variant="contained"
          sx={{
            backgroundColor: "#3fbdbd",
            color: "black",
            minWidth: "180px"
          }}
          onClick={onClose}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreprocessingDialog;
