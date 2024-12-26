import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js';
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
  
  const renderCorrelationHeatmap = () => {
    const correlationMatrix = analysis.correlation_matrix;
    const variables = Object.keys(correlationMatrix);
    const components = Object.keys(correlationMatrix[variables[0]]);

    const zValues = variables.map(variable =>
        components.map(component => correlationMatrix[variable][component])
    );

    return (
      <ResponsivePlot
        data={[
            {
                z: zValues,
                x: components,
                y: variables,
                type: 'heatmap',
                colorscale: 'RdBu',
                hoverongaps: false,
                showscale: true,
                colorbar: {
                    title: 'Correlation',
                    titleside: 'right',
                },
                text: zValues.map(row => row.map(value => value.toFixed(2))),
                texttemplate: '%{text}',
                textfont: {
                    size: 12,
                    color: '#000000',
                },
            },
        ]}
        layout={{
            autosize: true,
            title: 'Correlation matrix',
            xaxis: {
                automargin: true,
            },
            yaxis: {
                autorange: 'reversed',
                automargin: true,
            },
            hovermode: 'closest',
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
          {renderCorrelationHeatmap()}
        </div>
      )}
    </div>
  );
}

export default Summary