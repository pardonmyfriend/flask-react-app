import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const Clustering = ({ handleTileClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="K-Means" 
        color="#072E33" 
        onClick={() => handleTileClick('K-Means')} 
      />
      <Tile 
        title="DBSCAN" 
        color="#0A6E70" 
        onClick={() => handleTileClick('DBSCAN')} 
      />
      <Tile 
        title="Agglomerative Clustering" 
        color="#0D969C" 
        onClick={() => handleTileClick('Agglomerative Clustering')} 
      />
    </Box>
  );
};

export default Clustering;
