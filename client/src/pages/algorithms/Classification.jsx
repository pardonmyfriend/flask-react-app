import React from 'react';
import Tile from '../../components/Tile';
import { Box, Alert } from '@mui/material';

const Classification = ({ handleTileClick, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected, target }) => {
  return (
    <Box>
      {!target && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No target column found. Please ensure your dataset includes a target column to perform classification.
        </Alert>
      )}
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        <Tile 
          title="KNN"
          info={{
            name: "K-Nearest Neighbors",
            description: "Classifies data points based on the majority class of their k nearest neighbors in the feature space."
          }}
          onClick={() => handleTileClick('KNN')} 
          algorithmName={algorithmName}
          setAlgorithmName={setAlgorithmName}
          params={params}
          setParams={setParams}
          algorithmSelected={algorithmSelected}
          setAlgorithmSelected={setAlgorithmSelected}
          disabled={!target}
        />
        <Tile 
          title="Decision Tree"
          info={{
            name: "Decision Tree",
            description: "Builds a tree-like model of decisions and outcomes to classify or predict data based on input features."
          }}
          onClick={() => handleTileClick('Decision Tree')} 
          algorithmName={algorithmName}
          setAlgorithmName={setAlgorithmName}
          params={params}
          setParams={setParams}
          algorithmSelected={algorithmSelected}
          setAlgorithmSelected={setAlgorithmSelected}
          disabled={!target}
        />
        <Tile 
          title="SVM"
          info={{
            name: "Support Vector Machine",
            description: "Finds the optimal hyperplane to classify data into categories, maximizing the margin between classes."
          }}
          onClick={() => handleTileClick('SVM')} 
          algorithmName={algorithmName}
          setAlgorithmName={setAlgorithmName}
          params={params}
          setParams={setParams}
          algorithmSelected={algorithmSelected}
          setAlgorithmSelected={setAlgorithmSelected}
          disabled={!target}
        />
      </Box>
    </Box>
  );
};

export default Classification;
