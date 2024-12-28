import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import BarPlot from "../../components/plots/BarPlot";

function KMeans({ kmeansData, target }) {
    const renderClusteredDataframe = () => {
        const keys = Object.keys(kmeansData.clustered_dataframe[0]);

        const orderedKeys = keys.includes(target) 
            ? ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster' && key !== target), 'cluster', target] 
            : ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = kmeansData.clustered_dataframe;

        return (
            <DataPresentation
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

    const renderClusterSizes = () => {
        const clusters = Object.keys(kmeansData.cluster_sizes);
        const clusterCounts = Object.values(kmeansData.cluster_sizes);
    
        const mappedClusters = clusters.map((cluster) => 
            `Cluster ${cluster}`
        );
    
        return (
            <BarPlot 
                xData={mappedClusters}
                yData={clusterCounts}
                title="Cluster Sizes"
                xTitle="Cluster"
                yTitle="Count"
            />
        );
    };

    const renderCentroidsTable = () => {
        const keys = Object.keys(kmeansData.centroids[0]);

        const cols = keys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(keys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = kmeansData.centroids.map((row) => ({
            ...row,
            id: row.cluster,
        }));

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderIntraClusterDistances = () => {
        const clusters = kmeansData.intra_cluster_distances.map(item => item.cluster);
        const distances = kmeansData.intra_cluster_distances.map(item => item['intra-cluster distance']);
        
        const mappedClusters = clusters.map((cluster) => 
            `Cluster ${cluster}`
        );
    
        return (
            <BarPlot 
                xData={mappedClusters}
                yData={distances}
                title="Intra-cluster Distances"
                xTitle="Cluster"
                yTitle="Average Distance"
            />
        );
    };

    const renderInterClusterDistances = () => {
        const clusterLabels = kmeansData.inter_cluster_distances.index.map(
            (label) => (`Cluster ${label}`)
        );
    
        return (
            <ResponsivePlot
                data={[
                    {
                        z: kmeansData.inter_cluster_distances.data,
                        x: clusterLabels,
                        y: clusterLabels,
                        type: "heatmap",
                        colorscale: "RdBu",
                        text: kmeansData.inter_cluster_distances.data.map(row => row.map(value => value.toFixed(2))),
                        hoverinfo: "text",
                    },
                ]}
                layout={{
                    title: "Inter-Cluster Distances Heatmap",
                    annotations: kmeansData.inter_cluster_distances.data.flatMap((row, i) =>
                        row.map((val, j) => ({
                            x: clusterLabels[j],
                            y: clusterLabels[i],
                            text: val.toFixed(2),
                            showarrow: false,
                            font: { size: 10, color: "#000" },
                        }))
                    ),
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                }}
            />
        );
    };

    const renderSilhouetteScore = () => {
        return (
            <p>
                Silhouette Score (Overall): {kmeansData.silhouette_score}
            </p>
        );
    };

    const renderSilhouetteScores = () => {
        return (
            <BarPlot 
                xData={kmeansData.pca_dataframe.map(row => row.id)}
                yData={kmeansData.pca_dataframe.map(row => row.silhouette_score)}
                title="Silhouette Scores for Each Point"
                xTitle="Point Index"
                yTitle="Silhouette Score"
                linear={false}
            />
        );
    };

    return (
        <div>
            {renderClusteredDataframe()}
            {renderScatterPlot()}
            {renderClusterSizes()}
            {renderCentroidsTable()}
            {renderIntraClusterDistances()}
            {renderInterClusterDistances()}
            {renderSilhouetteScore()}
            {renderSilhouetteScores()}
        </div>
    )
}

export default KMeans