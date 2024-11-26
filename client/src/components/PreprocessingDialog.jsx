import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, FormControl, InputLabel, DialogContentText, Checkbox, TextField, Autocomplete,
  List, ListItem, ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popover,
  Box, Typography,
  Menu, IconButton
 } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { useState, useEffect } from 'react';

function PreprocessingDialog({ open, onClose, selectedOption, onSelectChange, cols, setCols, setSelectedOption, anchorEl, setAnchorEl, selectedRow, setSelectedRow, handleCheckboxChange }) {
    const options = cols;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const headers = ['Column name', 'Current type', 'Change type'];
    const colTypes = ['numerical', 'nominal', 'categorical'];


    const handleOpenPopover = (event, row) => {
      event.stopPropagation(); // Zatrzymanie propagacji kliknięcia
      console.log("Open Popover Triggered");
      setAnchorEl(event.currentTarget);
      setSelectedRow(row);
    };

    const handleClosePopover = () => {
      setAnchorEl(null);
      setSelectedRow(null);
    };

    const handleOptionClick = (event, option) => {
      event.stopPropagation(); // Zatrzymuje propagację kliknięcia
      alert(`Wybrano opcję: ${option}`);
      setAnchorEl(null); // Zamknij Popover po wybraniu opcji
    };

    const ColumnList = ({ cols }) => {
      return (
        <List>
          {cols.map((col, index) => (
            <ListItem key={index}>
              <ListItemText primary={col.headerName} 
              sx={{
                color: "black",
              }}
              />
            </ListItem>
          ))}
        </List>
      );
    };

    const handleSelectChange = (event, index) => {
      const newCols = [...cols];  // Tworzymy nową kopię tablicy wierszy
      newCols[index].type = event.target.value;  // Zmieniamy pole 'type' na wybraną opcję
      setCols(newCols);  // Ustawiamy stan
    };

  return (
    <div style={{ position: 'relative' }}>
      <Dialog open={open} onClose={onClose} aria-hidden={!open}>
        <DialogTitle sx={{ textAlign: 'center' }}>{"Align column types"}</DialogTitle>
        <DialogContent>

        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1,
              border: '1px solid #ccc',
              borderRadius: 2, }}>
            <Typography variant="body1" sx={{ minWidth: '150px', marginRight: '8px', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: '5px' }}>Column name</Typography>
            <Typography variant="body1" sx={{ minWidth: '150px', marginRight: '8px', display: 'flex', alignItems: 'center', marginLeft: '10px', fontWeight: 'bold' }}>Current type</Typography>
            <Typography variant="body1" sx={{ minWidth: '150px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Change type</Typography>
            <Typography variant="body1" sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: 'auto' }}>Class</Typography>
            </Box>
          {cols.map((col, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginBottom: 1,
                border: '1px solid #ccc',
                borderRadius: 2, }}>
              {/* Typography po lewej */}
              <Typography variant="body1" sx={{ minWidth: '150px', marginRight: '8px', display: 'flex', alignItems: 'center' }}>{col.headerName}</Typography>
              <Typography variant="body1" sx={{ minWidth: '100px', marginRight: '8px', marginLeft: '5px', display: 'flex', alignItems: 'center' }}>{col.type}</Typography>
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
                  sx={{ minWidth: '150px', marginRight: '8px', display: 'flex', alignItems: 'center' }}
                >
                  {colTypes.map((colType, colIndex) => (
                    <MenuItem key={colIndex} value={colType}>{colType}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Checkbox
                checked={selectedOption === index+1}  // Tylko jeden checkbox jest zaznaczony
                onChange={(event) => handleCheckboxChange(event, index+1)}  // Obsługuje zmianę
                color="primary"
              />
            </Box>
          ))}
        </div>

          {/* <ColumnTable cols={cols} headers={headers} colTypes={colTypes}/> */}
          {/* <DialogContentText>
            Select a column
          </DialogContentText> */}
          
            {/* <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.headerName}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Nominal" placeholder="Columns" />
              )}
            />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.headerName}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Categorical" placeholder="Columns" />
              )}
            />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.headerName}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Numerical" placeholder="Columns" />
              )}
            />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
              <InputLabel>Target</InputLabel>
              <Select
                value={selectedOption}
                onChange={onSelectChange}
                label="Select column"
              >

                {options.map((option) => (
                <MenuItem key={option.field} value={option.field}>
                    {option.headerName}
                </MenuItem>
                ))}
              </Select>
                {/* <FormControlLabel
                control={<Checkbox checked={check1} onChange={(e) => handleChange(e, setCheck1)} />}
                label="CheckBox 1"
                /> 
            </FormControl> 
             <FormControl fullWidth>
                    <InputLabel id="select-label">Type</InputLabel>
                    <InputLabel id={`select-label-${index}`}>Type</InputLabel>
                    <Select
                      labelId="select-label"
                      value={selectedOption}
                      onChange={onSelectChange}
                      // style={{ width: '100%' }}
                      // MenuProps={{
                      //   style: { zIndex: 1300 }
                      // }}
                      fullWidth
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Maksymalna wysokość rozwijanej listy
                            zIndex: 1300,   // Priorytet warstwowy
                          },
                        },
                        disableScrollLock: true, // Odblokowuje przewijanie dla portalu
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                      }}
                    >
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                      <MenuItem value="option3">Option 3</MenuItem>
                    </Select>
                  </FormControl>   
            */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreprocessingDialog;
