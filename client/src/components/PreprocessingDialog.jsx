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

function PreprocessingDialog({ open, onClose, selectedOption, onSelectChange, cols, setCols, setSelectedOption, anchorEl, setAnchorEl, selectedRow, setSelectedRow }) {
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

    const ColumnTable = ({ cols, headers, colTypes }) => {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
           {headers.map((header, index) => (
          <React.Fragment key={index}>
          <div>{header}</div>
          </React.Fragment>))}

          {cols.map((col, index) => (
          <React.Fragment key={index}>
          <div>{col.headerName}</div>
          <div>{col.type}</div>
          <div>
            {/* <FormControl fullWidth>
              <InputLabel id={`select-label-${index}`}>Type</InputLabel>
              <Select
                labelId={`select-label-${index}`}
                value={selectedOption}
                onChange={(event) => onSelectChange(event, index)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Ustawienie maksymalnej wysokości menu
                      width: 'auto',  // Dopasowanie szerokości do zawartości
                      overflow: 'visible', // Zapewnia, że menu jest widoczne poza granicami rodzica
                    },
                  },
                }}
              >
                <MenuItem value={10}>Option 1</MenuItem>
                <MenuItem value={20}>Option 2</MenuItem>
                <MenuItem value={30}>Option 3</MenuItem>
              </Select>
            </FormControl> */}
            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
              {/* <InputLabel>Target</InputLabel> */}
              <Select
                value={selectedOption}
                onChange={onSelectChange}
                label="Select column"
              >

                {colTypes.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
                ))}
              </Select>
            </FormControl> 
          </div>
        </React.Fragment>
      ))}
        </div>)}

  return (
    <div style={{ position: 'relative' }}>
      <Dialog open={open} onClose={onClose} aria-hidden={!open}>
        <DialogTitle>{"Align column types"}</DialogTitle>
        <DialogContent>
          <ColumnTable cols={cols} headers={headers} colTypes={colTypes}/>
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
