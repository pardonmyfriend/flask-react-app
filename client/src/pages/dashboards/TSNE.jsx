import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Plot from "react-plotly.js";
import { useResizeDetector } from 'react-resize-detector';

function TSNE({ tsneData }) {
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
    
    const renderTSNEDataframe = () => {
        const keys = Object.keys(tsneData.tsne_dataframe[0]);

        console.log(keys)

        const orderedKeys = keys.includes('id') 
        ? ['id', ...keys.filter((key) => key !== 'id')] 
        : keys;
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        return (
            <DataGrid
                rows={tsneData.tsne_dataframe}
                columns={cols}
                loading={!tsneData.tsne_dataframe.length}
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
        const uniqueSpecies = [...new Set(tsneData.tsne_dataframe.map(row => row.species))];
        const colorMap = uniqueSpecies.reduce((map, species, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[species] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueSpecies.map(species => ({
            x: tsneData.tsne_dataframe
                .filter(row => row.species === species)
                .map(row => row.F1),
            y: tsneData.tsne_dataframe
                .filter(row => row.species === species)
                .map(row => row.F2),
            type: 'scatter',
            mode: 'markers',
            name: species,
            marker: {
                color: colorMap[species],
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
                        text: 'Scatter plot: PC1 vs PC2',
                    },
                    xaxis: {
                        title: {
                            text: 'PC1',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    yaxis: {
                        title: {
                            text: 'PC2',
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
        const data = [
            {
                x: ['Trustworthiness Score'],
                y: [tsneData.trust_score],
                type: 'bar',
                name: 'Trustworthiness',
                marker: {
                    color: '#3FBDBD',
                },
            },
        ];
    
        return (
            <ResponsivePlot
                data={data}
                layout={{
                    autosize: true,
                    title: {
                        text: 'Trustworthiness Score',
                    },
                    xaxis: {
                        title: {
                            text: 'Metric',
                        },
                        automargin: true,
                        showgrid: false,
                    },
                    yaxis: {
                        title: {
                            text: 'Wartość',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: true,
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

    const renderHistogramPlots = () => {
        const originalDistancesFlat = tsneData.original_distances;
        const tsneDistancesFlat = tsneData.tsne_distances;
      
        return (
          <div>
            <ResponsivePlot
              data={[
                {
                  x: originalDistancesFlat,
                  type: "histogram",
                  nbinsx: 50,
                  marker: { color: '#329797' },
                },
              ]}
              layout={{
                title: "Histogram odległości w przestrzeni oryginalnej",
                xaxis: { title: "Odległość" },
                yaxis: { title: "Liczba par" },
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false, 
            }}
            />
      
            <ResponsivePlot
              data={[
                {
                  x: tsneDistancesFlat,
                  type: "histogram",
                  nbinsx: 50,
                  marker: { color: '#329797' },
                },
              ]}
              layout={{
                title: "Histogram odległości w przestrzeni t-SNE",
                xaxis: { title: "Distance" },
                yaxis: { title: "Pair count" },
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false, 
            }}
            />
          </div>
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
                {renderTSNEDataframe()}
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
                {renderHistogramPlots()}
            </div>

            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                {renderBarPlot()}
            </div>
        </div>
    )
}

export default TSNE