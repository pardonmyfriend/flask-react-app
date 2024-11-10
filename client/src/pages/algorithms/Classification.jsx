import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const Classification = ({ handleTileClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="KNN" 
        color="#072E33" 
        onClick={() => handleTileClick('KNN')} 
      />
      <Tile 
        title="Decision Tree" 
        color="#0A6E70" 
        onClick={() => handleTileClick('Decision Tree')} 
      />
      <Tile 
        title="Logistic Regression" 
        color="#0D969C" 
        onClick={() => handleTileClick('Logistic Regression')} 
      />
    </Box>
  );
};

export default Classification;
