import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";

function PCA({ pcaData, target }) {
    const renderPCADataframe = () => {
        const keys = Object.keys(pcaData.pca_components[0]);

        const orderedKeys = keys.includes('id') 
        ? ['id', ...keys.filter((key) => key !== 'id')] 
        : keys;
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = pcaData.pca_components;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderEigenValuesData = () => {
        const keys = Object.keys(pcaData.eigen_values_data[0]);

        const orderedKeys = keys.includes('id') 
        ? ['id', ...keys.filter((key) => key !== 'id')] 
        : keys;
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        const rows = pcaData.eigen_values_data;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        const uniqueGroups = [...new Set(pcaData.pca_components.map(row => row[target]))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: pcaData.pca_components
                .filter(row => row[target] === group)
                .map(row => row.PC1),
            y: pcaData.pca_components
                .filter(row => row[target] === group)
                .map(row => row.PC2),
            type: 'scatter',
            mode: 'markers',
            name: group,
            marker: {
                color: colorMap[group],
                size: 10,
                symbol: 'circle',
            },
        }));

        return (
            <ScatterPlot
                data={data}
                title={'Scatter plot: PC1 vs PC2'}
                xTitle={'PC1'}
                yTitle={'PC2'}
            />
        );
    };

    const renderExplainedVariancePlot = () => {
        return (
            <ResponsivePlot
                data={[
                    {
                        x: [...Array(pcaData.explained_variance.length).keys()].map(i => `PC${i + 1}`),
                        y: pcaData.explained_variance,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {
                            color: '#3FBDBD',
                            size: 8,
                            symbol: 'circle',
                        },
                        line: {
                            color: '#3FBDBD',
                            width: 2,
                        },
                        name: 'Explained Variance',
                    },
                ]}
                layout={{
                    autosize: true,
                    title: {
                        text: 'Explained varance plot',
                        font: {
                            size: 22,
                            color: '#2c3e50',
                        },
                    },
                    xaxis: {
                        title: {
                            text: 'Principal components',
                            font: {
                                size: 18,
                            },
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    yaxis: {
                        title: {
                            text: 'Explained variance (%)',
                            font: {
                                size: 18,
                            },
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    hovermode: 'closest',
                    plot_bgcolor: '#f9f9f9',
                    paper_bgcolor: '#ffffff',
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
        const correlationMatrix = pcaData.correlation_matrix;
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
                        title: 'Korelacja',
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
                title: {
                    text: 'Correlation matrix',
                    font: {
                        size: 22,
                        color: '#2c3e50',
                    },
                },
                xaxis: {
                    title: {
                        text: 'Principal Components',
                        font: {
                            size: 18,
                        },
                    },
                    automargin: true,
                    side: 'bottom',
                },
                yaxis: {
                    title: {
                        text: 'Origianl variables',
                        font: {
                            size: 18,
                        },
                    },
                    automargin: true,
                },
                hovermode: 'closest',
                plot_bgcolor: '#f9f9f9',
                paper_bgcolor: '#ffffff',
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
            {renderPCADataframe()}
            {renderEigenValuesData()}
            {renderExplainedVariancePlot()}
            {renderScatterPlot()}
            {renderCorrelationHeatmap()}
        </div>
    )
}

export default PCA