import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const Clustering = ({ handleTileClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile title="K-Means" image="/path/to/kmeans_image.png" color="#072E33" onClick={() => handleTileClick('K-Means')} />
      <Tile title="DBSCAN" image="/path/to/dbscan_image.png" color="#0A6E70" onClick={() => handleTileClick('DBSCAN')} />
      <Tile title="Hierarchical" image="/path/to/hierarchical_image.png" color="#0D969C" onClick={() => handleTileClick('Hierarchical')} />
    </Box>
  );
};

export default Clustering;
