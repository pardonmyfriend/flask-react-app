import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function PCA({ pcaData }) {
    const renderPCADataframe = () => {
        const keys = Object.keys(pcaData.pca_components[0]);

        const orderedKeys = keys.includes('id') 
        ? ['id', ...keys.filter((key) => key !== 'id')] 
        : keys;
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        const rows = pcaData.pca_components;

        return (
            <DataTable
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
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        const uniqueSpecies = [...new Set(pcaData.pca_components.map(row => row.species))];
        const colorMap = uniqueSpecies.reduce((map, species, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[species] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueSpecies.map(species => ({
            x: pcaData.pca_components
                .filter(row => row.species === species)
                .map(row => row.PC1),
            y: pcaData.pca_components
                .filter(row => row.species === species)
                .map(row => row.PC2),
            type: 'scatter',
            mode: 'markers',
            name: species,
            marker: {
                color: colorMap[species],
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
                        text: 'Wykres wyjaśnionej wariancji',
                        font: {
                            size: 22,
                            color: '#2c3e50',
                        },
                    },
                    xaxis: {
                        title: {
                            text: 'Składowe główne',
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
                            text: 'Wyjaśniona wariancja (%)',
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
                    text: 'Macierz korelacji (Heatmapa)',
                    font: {
                        size: 22,
                        color: '#2c3e50',
                    },
                },
                xaxis: {
                    title: {
                        text: 'Główne Składowe (PC)',
                        font: {
                            size: 18,
                        },
                    },
                    automargin: true,
                    side: 'bottom',
                },
                yaxis: {
                    title: {
                        text: 'Zmienne',
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