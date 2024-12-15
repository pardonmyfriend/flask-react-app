import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const DimensionReduction = ({ handleTileClick, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="PCA"
        onClick={() => handleTileClick('PCA')} 
        algorithmName={algorithmName}
        setAlgorithmName={setAlgorithmName}
        params={params}
        setParams={setParams}
        algorithmSelected={algorithmSelected}
        setAlgorithmSelected={setAlgorithmSelected}
      />

      <Tile 
        title="t-SNE"
        onClick={() => handleTileClick('t-SNE')}
        algorithmName={algorithmName}
        setAlgorithmName={setAlgorithmName}
        params={params}
        setParams={setParams}
        algorithmSelected={algorithmSelected}
        setAlgorithmSelected={setAlgorithmSelected}
      />
    </Box>
  );
};

export default DimensionReduction;
