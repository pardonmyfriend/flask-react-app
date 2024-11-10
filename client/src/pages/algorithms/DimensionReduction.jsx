import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const DimensionReduction = ({ handleTileClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="PCA"
        color="#072E33" 
        onClick={() => handleTileClick('PCA')} 
      />

      <Tile 
        title="t-SNE"
        color="#0D969C" 
        onClick={() => handleTileClick('t-SNE')} 
      />
    </Box>
  );
};

export default DimensionReduction;
