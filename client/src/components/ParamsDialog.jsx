import { React, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControlLabel, Checkbox } from '@mui/material';
import NumericInput from 'react-numeric-input';

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
    const paramType = paramInfo.type;

    if (paramType === 'int') {
      return (
        <NumericInput
          key={paramName}
          label={paramName}
          value={params[paramName] || ''}
          min={paramInfo.min}
          max={paramInfo.max}
          onChange={(value) => handleParamChange(paramName, value)}
        />
      );
    } else if (paramType === 'boolean') {
      return (
        <FormControlLabel
          key={paramName}
          control={
            <Checkbox
              checked={!!params[paramName]}
              onChange={(e) => handleParamChange(paramName, e.target.checked)}
            />
          }
          label={paramName}
        />
      );
    }
    // Możesz dodać inne typy, np. string, float, itp.
    return (
      <TextField
        key={paramName}
        label={paramName}
        value={params[paramName] || ''}
        onChange={(e) => handleParamChange(paramName, e.target.value)}
        margin="dense"
        fullWidth
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ustaw parametry dla {algorithmName}</DialogTitle>
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
