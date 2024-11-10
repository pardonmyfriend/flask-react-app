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
        title="LDA"
        color="#0A6E70" 
        onClick={() => handleTileClick('lda')} 
      />

      <Tile 
        title="T-SNE"
        color="#0D969C" 
        onClick={() => handleTileClick('T-SNE')} 
      />
    </Box>
  );
};

export default DimensionReduction;
