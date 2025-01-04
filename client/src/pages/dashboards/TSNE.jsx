import React from "react";
import { Typography } from "@mui/material";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import ScatterPlot3D from "../../components/plots/ScatterPlot3D";
import HistogramPlot from "../../components/plots/HistogramPlot";
import DataDescription from "../../components/plots/DataDescription";

function TSNE({ tsneData, target, params }) {
    const renderTSNEDataframe = () => {
        const keys = Object.keys(tsneData.tsne_dataframe[0]);

        const orderedKeys = keys.includes(target) 
        ? ['id', ...keys.filter((key) => key !== 'id' && key !== target), target] 
        : ['id', ...keys.filter((key) => key !== 'id')];
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = tsneData.tsne_dataframe;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const keys = Object.keys(tsneData.tsne_dataframe[0]);
    const fKeys = keys.filter(key => key.startsWith('F'));
    const numComponents = fKeys.length;

    const renderScatterPlot = () => {
        const uniqueGroups = [...new Set(tsneData.tsne_dataframe.map(row => row[target]))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});

        if (numComponents === 3) {
            const data = uniqueGroups.map(group => ({
                x: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => row.F1),
                y: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => row.F2),
                z: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => row.F3),
                customdata: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => ({ id: row.id })),
                type: 'scatter3d',
                mode: 'markers',
                name: group,
                marker: {
                    color: colorMap[group],
                    size: 5,
                    symbol: 'circle',
                },
                hovertemplate: `%{customdata.id}: (%{x}, %{y}, %{z})<extra>${group}</extra>`,
            }));
    
            return (
                <ScatterPlot3D
                    data={data}
                    title={'t-SNE Scatter Plot'}
                    xTitle={'F1'}
                    yTitle={'F2'}
                    zTitle={'F3'}
                />
            );
        } else {
            const data = uniqueGroups.map(group => ({
                x: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => row.F1),
                y: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => row.F2),
                customdata: tsneData.tsne_dataframe
                    .filter(row => row[target] === group)
                    .map(row => ({ id: row.id })),
                type: 'scatter',
                mode: 'markers',
                name: group,
                marker: {
                    color: colorMap[group],
                    size: 7,
                    symbol: 'circle',
                },
                hovertemplate: `%{customdata.id}: (%{x}, %{y})<extra>${group}</extra>`,
            }));
    
            return (
                <ScatterPlot
                    data={data}
                    title={'t-SNE Scatter Plot'}
                    xTitle={'F1'}
                    yTitle={'F2'}
                />
            );
        }
    };   

    const renderHistogramForOriginalSpace = () => {
        const originalDistancesFlat = tsneData.original_distances;
      
        return (
            <HistogramPlot 
                xData={originalDistancesFlat}
                title={"Histogram of Distances in Original Space"}
                xTitle={"Distance"}
                yTitle={"Pair Count"}
            />
        );
    };

    const renderHistogramForTSNESpace = () => {
        const tsneDistancesFlat = tsneData.tsne_distances;
      
        return (
            <HistogramPlot 
                xData={tsneDistancesFlat}
                title={"Histogram of Distances in t-SNE Space"}
                xTitle={"Distance"}
                yTitle={"Pair Count"}
            />
        );
    };

    const renderMetrics = () => {
        const metrics = tsneData.metrics;

        const cols = [
            { field: 'id', headerName: 'Metric', flex: 1 },
            { field: 'Value', headerName: 'Value', flex: 1 },
        ];

        const rows = metrics.map((metric) => ({
            id: metric.Metric,
            Value: metric.Value,
        }));

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    }

    return (
        <div>
            <h1>t-SNE</h1>
            <DataDescription
                title={'Parameters'}
                notExpanded={true}
            >
                <Typography 
                    variant="body1" 
                    sx={{ textAlign: 'left' }}
                >
                    {params && Object.keys(params).map((paramName) => (
                        <span key={paramName}>
                            <b>{paramName}</b>: { 
                                typeof params[paramName] === 'boolean' 
                                ? (params[paramName] ? 'true' : 'false')
                                : params[paramName]
                            }
                            <br />
                        </span>
                    ))}
                </Typography>
            </DataDescription>
            <DataDescription
                title="Transformed Data"
                description="This table displays the data points after t-SNE transformation. Each row corresponds to a point represented in the reduced-dimensional space."
            >
                {renderTSNEDataframe()}
            </DataDescription>

            {numComponents <= 3 &&
                <DataDescription
                    title="t-SNE Scatter Plot"
                    description="This scatter plot visualizes the dataset in the reduced-dimensional space obtained from t-SNE, using the first two or three dimensions."
                >
                    {renderScatterPlot()}
                </DataDescription>
            }

            <DataDescription
                title="Distribution of Pairwise Distances"
                description="This histograms represent the distribution of pairwise distances in the original high-dimensional space and t-SNE reduced-dimensional space."
            >
                {renderHistogramForOriginalSpace()}
                {renderHistogramForTSNESpace()}
            </DataDescription>

            <DataDescription
                title="t-SNE Quality Metrics"
                description="This table summarizes various quality metrics for the t-SNE transformation, including trustworthiness, continuity, and others."
            >
                {renderMetrics()}
            </DataDescription>
        </div>
    )
}

export default TSNE