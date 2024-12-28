import React from 'react';
import Tile from '../../components/Tile';
import { Box } from '@mui/material';

const Clustering = ({ handleTileClick, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Tile 
        title="K-Means"
        info={{
          name: "K-Means Clustering",
          description: "Partitions data into k clusters by minimizing the distance between data points and their assigned cluster centroids."
        }}
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
        info={{
          name: "Density-Based Spatial Clustering of Applications with Noise",
          description: "Clusters data based on density, identifying core samples and noise, and is effective for non-linear distributions."
        }}
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
        info={{
          name: "Agglomerative Clustering",
          description: "Hierarchical clustering that iteratively merges the closest clusters, creating a dendrogram to explore data structure."
        }}
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
