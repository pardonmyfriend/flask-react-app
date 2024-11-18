import React from 'react'
import PCA from './PCA';

function Dashboard({ data, algorithmName, params }) {
  const algorithmComponents = {
    PCA: <PCA data={data} params={params} />,
    // TSNE: <TSNE data={data} params={params} />,
    // KNN: <KNN data={data} params={params} />,
    // KMeans: <KMeans data={data} params={params} />,
  };

  const SelectedDashboard = algorithmComponents[algorithmName] || (
    <div>Nieznany algorytm: {algorithmName}</div>
  );

  return <div>{SelectedDashboard}</div>;
}

export default Dashboard