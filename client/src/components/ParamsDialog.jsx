import { React, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControlLabel, Checkbox, Box, Typography, Tooltip, IconButton, Select, MenuItem, FormControl } from '@mui/material';
// import NumericInput from 'react-numeric-input';
// import InputNumber from 'rc-input-number';
// import { NumericFormat } from 'react-number-format';
import NumericInput from './NumericInput';
import InfoIcon from '@mui/icons-material/Info';

function ParamsDialog({ open, onClose, onSaveParams, algorithmName, paramInfo }) {
  const [params, setParams] = useState({});

  useEffect(() => {
    if (open && paramInfo) {
      const defaultParams = {};
      Object.keys(paramInfo).forEach(param => {
        defaultParams[param] = paramInfo[param].default;
      })
      setParams(defaultParams)
    }
  }, [open, paramInfo])

  useEffect(() => {
    if (!open) {
      setParams({})
    }
  }, [open])

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

  const renderParamInput = (paramName, paramInfo) => {
    const type = paramInfo.type;
    const description = paramInfo.description;

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
        {type === 'int' || type === 'float' ? (
          <NumericInput
            min={paramInfo.min}
            max={paramInfo.max}
            defaultValue={paramInfo.default}
            step={type === 'float' ? paramInfo.step : 1}
            precision={type === 'float' ? paramInfo.precision : 0}
            onChange={(value) => handleParamChange(paramName, value)}
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
        {Object.keys(paramInfo).map((paramName) => renderParamInput(paramName, paramInfo[paramName]))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Anuluj</Button>
        <Button onClick={handleSave} color="primary">Zapisz</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ParamsDialog;
