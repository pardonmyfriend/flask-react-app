import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const Clustering = ({ handleTileClick, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="K-Means"
        onClick={() => handleTileClick('K-Means')} 
        algorithmName={algorithmName}
        setAlgorithmName={setAlgorithmName}
        params={params}
        setParams={setParams}
        algorithmSelected={algorithmSelected}
        setAlgorithmSelected={setAlgorithmSelected}
      />
      <Tile 
        title="DBSCAN"
        onClick={() => handleTileClick('DBSCAN')}
        algorithmName={algorithmName}
        setAlgorithmName={setAlgorithmName}
        params={params}
        setParams={setParams}
        algorithmSelected={algorithmSelected}
        setAlgorithmSelected={setAlgorithmSelected}
      />
      <Tile 
        title="Agglomerative Clustering" 
        onClick={() => handleTileClick('Agglomerative Clustering')} 
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

export default Clustering;
