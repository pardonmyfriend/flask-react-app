import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const Classification = ({ handleTileClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile title="SVM" image="/path/to/svm_image.png" color="#072E33" onClick={() => handleTileClick('SVM')} />
      <Tile title="Random Forest" image="/path/to/rf_image.png" color="#0A6E70" onClick={() => handleTileClick('Random Forest')} />
      <Tile title="Logistic Regression" image="/path/to/logistic_image.png" color="#0D969C" onClick={() => handleTileClick('Logistic Regression')} />
    </Box>
  );
};

export default Classification;
