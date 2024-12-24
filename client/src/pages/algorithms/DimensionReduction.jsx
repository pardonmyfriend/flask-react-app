import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const DimensionReduction = ({ handleTileClick, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="PCA"
        info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
        }}
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
        info={{
          name: "t-Distributed Stochastic Neighbor Embedding",
          description: "Visualizes high-dimensional data by projecting it onto a 2D or 3D space, preserving local relationships."
        }}
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
