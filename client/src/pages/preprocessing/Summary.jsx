import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import DataPresentation from '../../components/plots/DataPresentation';
import ResponsivePlot from '../../components/plots/ResponsivePlot';

const Summary = ({ data, target }) => {
  const [analysis, setAnalysis] = useState(null);
  useEffect(() => {
    if (data) {
      fetchAnalysis();
    }
  }, [data, target]);

  const fetchAnalysis = async () => {
    const payload = {
      data: data.rows,
      target: target
    };
    
    try {
      const response = await fetch('http://localhost:5000/data/get_data_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const responseData = await response.json();
      setAnalysis(responseData);
      console.log(responseData);
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const renderBasicStats = () => {
    const basicStats = analysis.basic_stats;

    const rows = basicStats.map((row) => ({
      id: row.index,
      Q1: row['25%'],
      Q2: row['50%'],
      Q3: row['75%'],
      ...row,
    }));

    const cols = [
      { field: 'id', headerName: 'ID', width: 150 },
      { field: 'count', headerName: 'Count', width: 100 },
      { field: 'mean', headerName: 'Mean', width: 100 },
      { field: 'std', headerName: 'Std', width: 100 },
      { field: 'min', headerName: 'Min', width: 100 },
      { field: 'Q1', headerName: 'Q1', width: 100 },
      { field: 'Q2', headerName: 'Q2', width: 100 },
      { field: 'Q3', headerName: 'Q3', width: 100 },
      { field: 'max', headerName: 'Max', width: 100 },
      { field: 'data_type', headerName: 'Data Type', width: 100 },
    ];

    console.log(rows)
    console.log(cols)

    return (
        <DataPresentation
            rows={rows}
            cols={cols}
        />
    );
  };

  const renderClassesCountsPlot = () => {
    const classes = Object.keys(analysis.target_analysis);
    const classesCounts = Object.values(analysis.target_analysis);

    const data = [
        {
            x: classes,
            y: classesCounts,
            type: "bar",
            name: "Classes sizes",
            marker: {
                color: "#3FBDBD",
            },
        },
    ];

    return (
        <ResponsivePlot
            data={data}
            layout={{
                autosize: true,
                title: "Classes sizes",
                xaxis: {
                    title: "Class",
                    automargin: true,
                    showgrid: false,
                    tickmode: "linear",
                },
                yaxis: {
                    title: "Count",
                    automargin: true,
                    showgrid: true,
                },
                hovermode: "closest",
            }}
            config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
            }}
        />
    );
  };    

  return (
    <div>
      {analysis && (
        <div>
          {renderBasicStats()}
          {renderClassesCountsPlot()}

          {/* <h2>Correlation Matrix</h2>
          <Plot
            data={[
              {
                z: Object.values(analysis.correlation_matrix),
                x: Object.keys(analysis.correlation_matrix),
                y: Object.keys(analysis.correlation_matrix),
                type: 'heatmap',
                colorscale: 'Viridis',
              },
            ]}
            layout={{ title: 'Correlation Matrix', height: 500 }}
          />

          <h2>Missing Data</h2>
          <Plot
            data={[
              {
                x: Object.keys(analysis.missing_data),
                y: Object.values(analysis.missing_data),
                type: 'bar',
              },
            ]}
            layout={{ title: 'Missing Data (%)', height: 500 }}
          />

          <h2>Distributions</h2>
          {Object.entries(analysis.distribution).map(([column, dist]) => (
            <div key={column}>
              <h3>{column}</h3>
              <Plot
                data={[
                  {
                    x: Object.keys(dist.histogram),
                    y: Object.values(dist.histogram),
                    type: 'bar',
                  },
                ]}
                layout={{ title: `${column} Histogram`, height: 500 }}
              />
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
}

export default Summary