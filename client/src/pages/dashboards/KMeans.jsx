import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function KMeans({ kmeansData, target }) {
    const renderClusteredDataframe = () => {
        const keys = Object.keys(kmeansData.clustered_dataframe[0]);

        const orderedKeys = keys.includes('id') 
            ? ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'] 
            : [...keys.filter((key) => key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = kmeansData.clustered_dataframe;

        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        const uniqueClusters = [...new Set(kmeansData.pca_dataframe.map(row => row.cluster))];
        const colorMap = uniqueClusters.reduce((map, cluster, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[cluster] = colors[index % colors.length];
            return map;
        }, {});

        const data = uniqueClusters.map(cluster => ({
            x: kmeansData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row.PC1),
            y: kmeansData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row.PC2),
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
            <ScatterPlot
                data={data}
                title={'Clusters Visualized with PCA'}
                xTitle={'PC1'}
                yTitle={'PC2'}
            />
        );
    };

    const renderScatterPlotForTarget = () => {
        const uniqueGroups = [...new Set(kmeansData.pca_dataframe.map(row => row[target]))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: kmeansData.pca_dataframe
                .filter(row => row[target] === group)
                .map(row => row.PC1),
            y: kmeansData.pca_dataframe
                .filter(row => row[target] === group)
                .map(row => row.PC2),
            type: 'scatter',
            mode: 'markers',
            name: group,
            marker: {
                color: colorMap[group],
                size: 7,
                symbol: 'circle',
            },
        }));

        return (
            <ScatterPlot
                data={data}
                title={'Scatter plot for classes'}
                xTitle={'x'}
                yTitle={'y'}
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
            ...(kmeansData.centroids[0].length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = kmeansData.centroids;

        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    return (
        <div>
            {renderClusteredDataframe()}
            {renderScatterPlot()}
            {renderScatterPlotForTarget()}
            {renderBarPlot()}
            {renderCentroids()}
        </div>
    )
}

export default KMeans