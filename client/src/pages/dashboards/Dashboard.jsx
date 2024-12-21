import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PCA from './PCA';
import TSNE from './TSNE';
import KMeans from './KMeans';
import DBSCAN from './DBSCAN';
import AgglomerativeClustering from './AgglomerativeClustering';
import KNN from './KNN';
import DecisionTree from './DecisionTree';
import SVM from './SVM';

function Dashboard({ data, algorithmName, params, target }) {
  const [algorithmData, setAlgorithmData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!algorithmName) return;

      setLoading(true);
      setError(null);

      const payload = {
          params: params,
          data: data.rows,
          target: target
      };

      try {
        const response = await fetch(`http://localhost:5000/algorithms/run_${algorithmName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const result = await response.json();
        console.log(result)
        setAlgorithmData(result);
      } catch (err) {
        setError(`Error in data fetching: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [algorithmName, data, params]);


  const renderAlgorithmComponent = () => {
    if (!algorithmData) {
      return null;
    }

    switch (algorithmName) {
      case 'PCA':
        return <PCA pcaData={algorithmData} target={target} />;
      case 't-SNE':
        return <TSNE tsneData={algorithmData} target={target} />;
      case 'K-Means':
        return <KMeans kmeansData={algorithmData} target={target} />;
      case 'DBSCAN':
          return <DBSCAN dbscanData={algorithmData} target={target} />;
      case 'Agglomerative Clustering':
        return <AgglomerativeClustering aggData={algorithmData} target={target} />;
      case 'KNN':
        return <KNN knnData={algorithmData} />;
      case 'Decision Tree':
        return <DecisionTree treeData={algorithmData} />
      case 'SVM':
        return <SVM svmData={algorithmData} />
      default:
        return <div>Nieznany algorytm: {algorithmName}</div>;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1 // Ustaw wysokość na cały ekran
          // width: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>{renderAlgorithmComponent()}</div>;
}

export default Dashboard