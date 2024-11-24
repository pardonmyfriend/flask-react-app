import React, { useState, useEffect } from 'react';
import PCA from './PCA';
import TSNE from './TSNE';

function Dashboard({ data, algorithmName, params }) {
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
          data: data.rows
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
        return <PCA pcaData={algorithmData} />;
      case 't-SNE':
        return <TSNE tsneData={algorithmData} />;
      default:
        return <div>Nieznany algorytm: {algorithmName}</div>;
    }
  };

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>{renderAlgorithmComponent()}</div>;
}

export default Dashboard