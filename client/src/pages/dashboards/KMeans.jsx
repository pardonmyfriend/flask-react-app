import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Plot from "react-plotly.js";
import { useResizeDetector } from 'react-resize-detector';

function KMeans({ kmeansData }) {
    const dataGridStyle = {
        verflowY: 'auto',
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            fontSize: '17px',
        },
        '& .MuiDataGrid-row:nth-of-type(2n)': {
            backgroundColor: '#f6f6f6',
        },
        '& .MuiDataGrid-toolbar': {
            color: 'white',
        },
        '& .MuiButton-textPrimary': {
            color: 'white !important',
        },
        '& .MuiTypography-root': {
            color: 'white !important',
        },
        '& .MuiButtonBase-root': {
            color: 'white !important',
        },
        '& .MuiSvgIcon-root': {
            color: '#3fbdbd !important',
        },
        '& .MuiDataGrid-columnsManagement': {
            backgroundColor: '#3fbdbd !important',
        },
    };

    const renderClusteredDataframe = () => {
        const keys = Object.keys(kmeansData.clustered_dataframe[0]);

        // const orderedKeys = keys.includes('id') 
        //   ? ['id', ...keys.filter((key) => key !== 'id')] 
        //   : keys;

        const orderedKeys = keys.includes('id') 
            ? ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'] 
            : [...keys.filter((key) => key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        return (
            <DataGrid
                rows={kmeansData.clustered_dataframe}
                columns={cols}
                loading={!kmeansData.clustered_dataframe.length}
                showCellVerticalBorder
                showColumnVerticalBorder
                checkboxSelection={false}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25, 50]}
                sx={dataGridStyle}
                slots={{
                    toolbar: GridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        sx: {
                            backgroundColor: '#474747',
                            fontWeight: 'bold',
                            padding: '10px',
                            fontSize: '30px',
                            color: '#ffffff',
                            '& .MuiButtonBase-root': {
                                color: 'white',
                            },
                        },
                    },
                }}
            />
        );
    };

    const ResponsivePlot = ({ data, layout, config }) => {
        const { width, height, ref } = useResizeDetector();

        return (
            <div ref={ref} style={{ width: '100%', height: '500px' }}>
                {width && height && (
                    <Plot
                        data={data}
                        layout={{ ...layout, width, height }}
                        config={config}
                    />
                )}
            </div>
        );
    };

    const renderScatterPlot = () => {
        const uniqueClusters = [...new Set(kmeansData.clustered_dataframe.map(row => row.cluster))];
        const colorMap = uniqueClusters.reduce((map, cluster, index) => {
            const colors = ['#3FBDBD', '#329797', '#257171', '#194B4B'];
            map[cluster] = colors[index % colors.length];
            return map;
        }, {});

        const [firstColumn, secondColumn] = Object.keys(kmeansData.clustered_dataframe[0]).filter(
            col => col !== 'cluster' && col !== 'id' // Wyklucz kolumny 'cluster' i 'id', jeśli istnieją
        );
    
        const data = uniqueClusters.map(cluster => ({
            x: kmeansData.clustered_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row[firstColumn]),
            y: kmeansData.clustered_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row[secondColumn]),
            type: 'scatter',
            mode: 'markers',
            name: cluster,
            marker: {
                color: colorMap[cluster],
                size: 7,
                symbol: 'circle',
            },
        }));

        return (
            <ResponsivePlot
                data={data}
                layout={{
                    autosize: true,
                    title: {
                        text: 'Clusters scatter plot',
                    },
                    xaxis: {
                        title: {
                            text: 'x',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    yaxis: {
                        title: {
                            text: 'y',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    legend: {
                        orientation: 'h',
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.2,
                    },
                    hovermode: 'closest',
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false, 
                }}
            />
        );
    };

    const renderScatterPlotForSpecies = () => {
        const uniqueSpecies = [...new Set(kmeansData.clustered_dataframe.map(row => row.species))];
        const colorMap = uniqueSpecies.reduce((map, species, index) => {
            const colors = ['#3FBDBD', '#329797', '#257171', '#194B4B'];
            map[species] = colors[index % colors.length];
            return map;
        }, {});

        const [firstColumn, secondColumn] = Object.keys(kmeansData.clustered_dataframe[0]).filter(
            col => col !== 'cluster' && col !== 'id'
        );
    
        const data = uniqueSpecies.map(species => ({
            x: kmeansData.clustered_dataframe
                .filter(row => row.species === species)
                .map(row => row[firstColumn]),
            y: kmeansData.clustered_dataframe
                .filter(row => row.species === species)
                .map(row => row[secondColumn]),
            type: 'scatter',
            mode: 'markers',
            name: species,
            marker: {
                color: colorMap[species],
                size: 7,
                symbol: 'circle',
            },
        }));

        console.log(data)

        return (
            <ResponsivePlot
                data={data}
                layout={{
                    autosize: true,
                    title: {
                        text: 'Clusters scatter plot',
                    },
                    xaxis: {
                        title: {
                            text: 'x',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    yaxis: {
                        title: {
                            text: 'y',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    legend: {
                        orientation: 'h',
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.2,
                    },
                    hovermode: 'closest',
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false, 
                }}
            />
        );
    };

    const renderBarPlot = () => {
        return (
            <ResponsivePlot
                data={[
                    {
                        x: ['Silhouette Score'],
                        y: [kmeansData.silhouette_score],
                        type: 'bar',
                        marker: { color: '#3FBDBD' },
                    },
                ]}
                layout={{
                    title: 'Clustering Quality (Silhouette Score)',
                    xaxis: { title: 'Metric' },
                    yaxis: { title: 'Score' },
                }}
            />
        );
    };

    const renderCentroids = () => {
        const cols = Object.keys(kmeansData.centroids[0]).map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        return (
            <DataGrid
                rows={kmeansData.centroids}
                columns={cols}
                loading={!kmeansData.centroids.length}
                pageSize={10}
                sx={dataGridStyle}
            />
        );
    };

    return (
        <div>
            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                {renderClusteredDataframe()}
            </div>

            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                {renderScatterPlot()}
            </div>

            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                {renderScatterPlotForSpecies()}
            </div>

            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                {renderBarPlot()}
            </div>

            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                {renderCentroids()}
            </div>
        </div>
    )
}

export default KMeans