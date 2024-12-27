import { React, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControlLabel, Checkbox, Box, Typography, Tooltip, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import NumericInput from './NumericInput';
import InfoIcon from '@mui/icons-material/Info';

function ParamsDialog({ open, onClose, onSaveParams, algorithmName, paramsInfo, defaultParams, params, setParams }) {
  useEffect(() => {
    if (open && defaultParams) {
      setParams(defaultParams)
    }
  }, [open, defaultParams])

  const handleParamChange = (paramName, value) => {
    setParams(prevParams => ({
      ...prevParams,
      [paramName]: value
    }));
  };

  const handleSave = () => {
    onSaveParams(params);
    onClose();
  };

  const renderParamInput = (paramName, paramInfo, defaultParam) => {
    const type = paramInfo.type;
    const description = paramInfo.description;
    const isNoneSelected = params[paramName] === null;

    const handleCheckboxChange = (event) => {
      const isChecked = event.target.checked;
      handleParamChange(paramName, isChecked ? null : paramInfo.min);

      if (paramInfo?.dependency && paramInfo.dependency[2] === 'uncheck') {
        handleParamChange(paramInfo.dependency[0], isChecked ? params[paramInfo.dependency[1]] : null);
      }
    };

    return (
      <Box key={paramName} display="flex" alignItems="center" mb={2}>
        <Typography variant="body1" component="label" sx={{ minWidth: '150px', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
          {paramName}
          {description && (
            <Tooltip title={description} arrow>
              <IconButton size="small" sx={{ marginLeft: '4px' }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
        {(type === 'int' || type === 'float') && paramInfo.nullable ? (
          <Box display='flex' alignItems='center'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isNoneSelected}
                  onChange={handleCheckboxChange}
                />
              }
              label='None'
            />
            <NumericInput
              min={paramInfo.min}
              max={paramInfo.max}
              defaultValue={defaultParam !== null ? defaultParam : paramInfo.min}
              step={type === 'float' ? paramInfo.step : 1}
              precision={type === 'float' ? paramInfo.precision : 0}
              onChange={(value) => handleParamChange(paramName, value)}
              disabled={isNoneSelected || (paramInfo.dependency && params[paramInfo.dependency[0]] !== paramInfo.dependency[1] && paramInfo.dependency[2] === 'enable')}
            />
          </Box>
        ) : type === 'int' || type === 'float' ? (
          <NumericInput
            min={paramInfo.min}
            max={paramInfo.max}
            defaultValue={defaultParam}
            step={type === 'float' ? paramInfo.step : 1}
            precision={type === 'float' ? paramInfo.precision : 0}
            onChange={(value) => handleParamChange(paramName, value)}
            disabled={paramInfo.dependency && params[paramInfo.dependency[0]] !== paramInfo.dependency[1] && paramInfo.dependency[2] === 'enable'}
          />
        ) : type === 'boolean' ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!params[paramName]}
                onChange={(e) => handleParamChange(paramName, e.target.checked)}
              />
            }
            label=""
          />
        ) : type === 'select' ? (
          <FormControl fullWidth>
            <Select
              value={params[paramName] || ''}
              onChange={(e) => handleParamChange(paramName, e.target.value)}
            >
              {paramInfo.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            value={params[paramName] || ''}
            onChange={(e) => handleParamChange(paramName, e.target.value)}
            fullWidth
          />
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set parameters for {algorithmName}</DialogTitle>
      <DialogContent>
        {Object.keys(paramsInfo).map((paramName) => renderParamInput(paramName, paramsInfo[paramName], defaultParams[paramName]))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ParamsDialog;
