import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Plot from "react-plotly.js";

function PCA({ data, params }) {
    const [pcaData, setPcaData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const payload = {
            params: params,
            data: data.rows
        };
        
        fetch("http://localhost:5000/algorithms/run_PCA", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setPcaData(data)
        })
        .finally(() => {
            setLoading(false);
        });
    }, [data, params]);

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

        return (
            <div style={{ 
                width: '80%'
            }}>
                <DataGrid
                    rows={pcaData.pca_components}
                    columns={cols}
                    loading={!pcaData.pca_components.length}
                    showCellVerticalBorder
                    showColumnVerticalBorder
                    checkboxSelection={false}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    sx={{
                        height: 500,
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
                    }}
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
            </div>
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

        return (
            <div style={{ 
                width: '80%'
            }}>
                <DataGrid
                    rows={pcaData.eigen_values_data}
                    columns={cols}
                    loading={!pcaData.eigen_values_data.length}
                    showCellVerticalBorder
                    showColumnVerticalBorder
                    checkboxSelection={false}
                    sx={{
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
                    }}
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
            </div>
        );
    };

    const renderScatterPlot = () => {
        const uniqueSpecies = [...new Set(pcaData.pca_components.map(row => row.species))];
        const colorMap = uniqueSpecies.reduce((map, species, index) => {
            const colors = ['#3FBDBD', '#329797', '#257171', '#194B4B'];
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
            <Plot
                data={data}
                layout={{
                    autosize: true,
                    title: {
                        text: 'Wykres rozrzutu: PC1 vs PC2',
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

    const renderExplainedVariancePlot = () => {
        return (
            <Plot
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
        // Pobieranie danych do heatmapy z macierzy korelacji
        const correlationMatrix = pcaData.correlation_matrix;
        const variables = Object.keys(correlationMatrix); // np. petallengthcm, petalwidthcm, etc.
        const components = Object.keys(correlationMatrix[variables[0]]); // np. PC1, PC2

        // Tworzenie macierzy wartości korelacji
        const zValues = variables.map(variable =>
            components.map(component => correlationMatrix[variable][component])
        );

        return (
            <Plot
                data={[
                    {
                        z: zValues,
                        x: components,
                        y: variables,
                        type: 'heatmap',
                        colorscale: 'Coolwarm', // Paleta typu coolwarm
                        hoverongaps: false,
                        showscale: true, // Wyświetlanie skali kolorów
                        colorbar: {
                            title: 'Korelacja',
                            titleside: 'right',
                        },
                        text: zValues.map(row => row.map(value => value.toFixed(2))), // Wartości do wyświetlenia
                        texttemplate: '%{text}', // Wyświetlanie wartości na heatmapie
                        textfont: {
                            size: 12, // Rozmiar czcionki wartości
                            color: '#000000', // Kolor czcionki (np. czarny)
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
        {loading && <p>Loading...</p>}
        {!loading && pcaData && (
            <>
                {/* Pierwszy wiersz: PCADataframe */}
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginBottom: '30px'
                }}>
                    {renderPCADataframe()}
                </div>

                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginBottom: '30px'
                }}>
                    {renderEigenValuesData()}
                </div>

                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginBottom: '30px'
                }}>
                    {renderExplainedVariancePlot()}
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
                    {renderCorrelationHeatmap()}
                </div>
            </>
        )}
        {!loading && !pcaData && <p>No results to show.</p>}
    </div>
  )
}

export default PCA