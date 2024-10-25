import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Grid2, Paper, Box } from '@mui/material';

function Dashboard() {
    const [irisData, setIrisData] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:5000/data/iris', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setIrisData(JSON.parse(resp));
        })
        .catch((error) => console.log(error));
    }, []);
  
    if (irisData.length === 0) return <div>Loading...</div>;
  
    const sepalLength = irisData.map((row) => row['sepal length (cm)']);
    const sepalWidth = irisData.map((row) => row['sepal width (cm)']);
    const petalLength = irisData.map((row) => row['petal length (cm)']);
    const petalWidth = irisData.map((row) => row['petal width (cm)']);
    const target = irisData.map((row) => row['target']);
  
    return (
      <Box sx={{ padding: '20px' }}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ padding: '20px' }}>
              <Plot
                data={[
                  {
                    x: sepalLength,
                    y: sepalWidth,
                    mode: 'markers',
                    marker: { color: target, colorscale: 'Viridis', size: 10 },
                    type: 'scatter',
                    name: 'Sepal',
                  },
                ]}
                layout={{
                  title: 'Sepal Length vs Sepal Width',
                  xaxis: { title: 'Sepal Length (cm)' },
                  yaxis: { title: 'Sepal Width (cm)' },
                  autosize: true,
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </Paper>
          </Grid2>
  
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ padding: '20px' }}>
              <Plot
                data={[
                  {
                    x: petalLength,
                    type: 'histogram',
                    marker: { color: 'blue' },
                    name: 'Petal Length',
                  },
                ]}
                layout={{
                  title: 'Distribution of Petal Length',
                  xaxis: { title: 'Petal Length (cm)' },
                  autosize: true,
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </Paper>
          </Grid2>
  
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ padding: '20px' }}>
              <Plot
                data={[
                  {
                    y: sepalWidth,
                    type: 'box',
                    name: 'Sepal Width',
                    marker: { color: 'orange' },
                  },
                  {
                    y: petalWidth,
                    type: 'box',
                    name: 'Petal Width',
                    marker: { color: 'green' },
                  },
                ]}
                layout={{
                  title: 'Sepal Width and Petal Width Distribution',
                  autosize: true,
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </Paper>
          </Grid2>
  
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ padding: '20px' }}>
              <Plot
                data={[
                  {
                    x: petalLength,
                    y: petalWidth,
                    mode: 'markers',
                    marker: { color: target, colorscale: 'Bluered', size: 10 },
                    type: 'scatter',
                    name: 'Petal',
                  },
                ]}
                layout={{
                  title: 'Petal Length vs Petal Width',
                  xaxis: { title: 'Petal Length (cm)' },
                  yaxis: { title: 'Petal Width (cm)' },
                  autosize: true,
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
    );
  }

export default Dashboard