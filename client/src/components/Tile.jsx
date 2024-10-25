import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Tile = ({ title, IconComponent, color, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      startIcon={IconComponent}
      sx={{
        width: 150,
        height: 150,
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        boxShadow: 3,
        margin: 1,
      }}
    >
      {title}
    </Button>
  );
};

export default Tile;
