import React, { useState, useEffect } from 'react'
import DataPresentation from '../../components/plots/DataPresentation';
import ResponsivePlot from '../../components/plots/ResponsivePlot';
import BarPlot from '../../components/plots/BarPlot';
import BarPlotGroup from '../../components/plots/BarPlotGroup';
import Box from '@mui/material/Box';
import DataDescription from '../../components/plots/DataDescription';
import Heatmap from '../../components/plots/Heatmap';

const Summary = ({ data, target }) => {
  const [analysis, setAnalysis] = useState(null);
  useEffect(() => {
    if (data) {
      fetchAnalysis();
    }
  }, [data, target]);

  const fetchAnalysis = async () => {
    console.log(data);
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
      { field: 'count', headerName: 'Count', width: 120 },
      { field: 'mean', headerName: 'Mean', width: 120 },
      { field: 'std', headerName: 'Std', width: 120 },
      { field: 'min', headerName: 'Min', width: 120 },
      { field: 'Q1', headerName: 'Q1', width: 120 },
      { field: 'Q2', headerName: 'Q2', width: 120 },
      { field: 'Q3', headerName: 'Q3', width: 120 },
      { field: 'max', headerName: 'Max', width: 120 },
      { field: 'data_type', headerName: 'Data Type', width: 120 },
    ];

    return (
        <DataPresentation
            rows={rows}
            cols={cols}
        />
    );
  };

  const renderClassesCountsPlot = () => {
    if (!analysis.target_analysis) return null;
    
    const classes = Object.keys(analysis.target_analysis);
    const classesCounts = Object.values(analysis.target_analysis);

    return (
      <BarPlot 
          xData={classes}
          yData={classesCounts}
          title="Classes Sizes"
          xTitle="Class"
          yTitle="Count"
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
      <Heatmap
          zData={zValues}
          xData={components}
          yData={variables}
          title="Correlation Matrix"
      />
    );
  };

  const renderBoxPlot = () => {
    const columnNames = Object.keys(analysis.box_plot[0]);
    
    const plotData = columnNames.map((feature) => ({
        y: analysis.box_plot.map((row) => feature),
        x: analysis.box_plot.map((row) => row[feature]),
        type: "box",
        name: feature,
        orientation: "h",
    }));

    return (
        <Box 
            sx={{
                height: '610px',
                overflowY: 'auto',
            }}
        >
            <ResponsivePlot
                data={plotData}
                layout={{
                    autosize: true,
                    title: "Feature Distributions",
                    xaxis: {
                        title: "Value",
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    yaxis: {
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    showlegend: false,
                    hovermode: 'closest',
                }}
                divHeight={400 + columnNames.length * 50}
            />
        </Box>
    );
  };


  const renderHistograms = () => {
    return (
        <Box
            sx={{
                height: '1250px',
                overflowY: 'auto',
            }}
        >
            {Object.keys(analysis.histograms).map((feature) => (
                <ResponsivePlot
                    key={feature}
                    data={[
                        {
                            x: analysis.histograms[feature],
                            type: 'histogram',
                            marker: { color: 'rgba(63, 189, 189, 0.6)' },
                        },
                    ]}
                    layout={{
                        title: `${feature}`,
                        yaxis: { title: 'Count' },
                        bargap: 0.05,
                    }}
                    divHeight={300}
                />
            ))}
        </Box>
    );
  };



  const renderCategoricalAnalysis = () => {
    return (
        <Box
            sx={{
                height: '510px',
                overflowY: 'auto',
            }}
        >
            {Object.keys(analysis.categorical_features).map((feature) => (
                <ResponsivePlot
                    key={feature}
                    data={[
                        {
                            labels: analysis.categorical_features[feature].labels,
                            values: analysis.categorical_features[feature].values,
                            type: 'pie',
                        },
                    ]}
                    layout={{
                        title: `${feature}`,
                        showlegend: true,
                    }}
                />
            ))}
        </Box>
    );
  };


  const renderKSTestResults = () => {
    const rows = Object.keys(analysis.kolmogorov_smirnov_test).map((feature) => ({
        id: feature,
        statistic: analysis.kolmogorov_smirnov_test[feature].statistic.toFixed(4),
        p_value: analysis.kolmogorov_smirnov_test[feature].p_value.toFixed(4),
    }));

    const cols = [
        { field: 'id', headerName: 'Feature', flex: 1 },
        { field: 'statistic', headerName: 'Statistic', flex: 1 },
        { field: 'p_value', headerName: 'P-Value', flex: 1 },
    ];

    return <DataPresentation rows={rows} cols={cols} />;
  };


  const renderSkewnessKurtosis = () => {
    const features = Object.keys(analysis.skewness_and_kurtosis);
    const skewness = features.map((feature) => analysis.skewness_and_kurtosis[feature].skewness);
    const kurtosis = features.map((feature) => analysis.skewness_and_kurtosis[feature].kurtosis);

    return (
      <BarPlotGroup
          xData={features}
          yData1={skewness}
          yData2={kurtosis}
          title={'Skewness and Kurtosis'}
          name1={'Skewness'}
          name2={'Kurtosis'}
          xTitle={'Feature'}
          yTitle={'Value'}
      />
    );
  };

  return (
    <div>
      {analysis && (
        <div>
          <DataDescription title="Basic Statistics">
              {renderBasicStats()}
          </DataDescription>
          <DataDescription title="Feature Distribution Histograms">
              {renderHistograms()}
          </DataDescription>
          <DataDescription title="Feature Distribution Box Plots">
              {renderBoxPlot()}
          </DataDescription>
          {analysis.target_analysis && (
            <DataDescription title="Target Column Distribution">
                {renderClassesCountsPlot()}
            </DataDescription>
          )}
          {analysis.categorical_features && Object.keys(analysis.categorical_features).length > 0 && (
            <DataDescription title="Categorical Feature Analysis">
                {renderCategoricalAnalysis()}
            </DataDescription>
          )}
          <DataDescription title="Correlation Matrix Heatmap">
              {renderCorrelationHeatmap()}
          </DataDescription>
          <DataDescription title="Kolmogorov-Smirnov Test Results for Normality">
              {renderKSTestResults()}
          </DataDescription>
          <DataDescription title="Skewness and Kurtosis Analysis">
              {renderSkewnessKurtosis()}
          </DataDescription>
        </div>
      )}
    </div>
  );
}

export default Summary