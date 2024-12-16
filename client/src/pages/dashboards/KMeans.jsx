import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useResizeDetector } from 'react-resize-detector';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function KMeans({ kmeansData }) {
    const renderClusteredDataframe = () => {
        const keys = Object.keys(kmeansData.clustered_dataframe[0]);

        const orderedKeys = keys.includes('id') 
            ? ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'] 
            : [...keys.filter((key) => key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
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
        const uniqueClusters = [...new Set(kmeansData.clustered_dataframe.map(row => row.cluster))];
        const colorMap = uniqueClusters.reduce((map, cluster, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[cluster] = colors[index % colors.length];
            return map;
        }, {});

        const [firstColumn, secondColumn] = Object.keys(kmeansData.clustered_dataframe[0]).filter(
            col => col !== 'cluster' && col !== 'id'
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
            <ScatterPlot
                data={data}
                title={'Clusters scatter plot'}
                xTitle={'x'}
                yTitle={'y'}
            />
        );
    };

    const renderScatterPlotForSpecies = () => {
        const uniqueSpecies = [...new Set(kmeansData.clustered_dataframe.map(row => row.species))];
        const colorMap = uniqueSpecies.reduce((map, species, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
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
            flex: 1,
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
            {renderScatterPlotForSpecies()}
            {renderBarPlot()}
            {renderCentroids()}
        </div>
    )
}

export default KMeans