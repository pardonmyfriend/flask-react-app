import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

function ConfirmDialog({ openConfirmDialog, setOpenConfirmDialog, handleConfirmDialogAnswer, columnName }) {

  const handleClose = (answer) => {
    setOpenConfirmDialog(false);
    console.log('Odpowiedź:', answer); // Można tu dodać logikę związaną z odpowiedzią
    handleConfirmDialogAnswer(answer);
  };

  return (
    <div>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <p>Do you want to delete <strong>{columnName}</strong> column?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('Yes')} color="primary">
            Yes
          </Button>
          <Button onClick={() => handleClose('No')} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;