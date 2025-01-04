import React from "react";
import { Typography } from "@mui/material";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import BarPlot from "../../components/plots/BarPlot";
import Heatmap from "../../components/plots/Heatmap";
import DataDescription from "../../components/plots/DataDescription";

function KMeans({ kmeansData, params }) {
    const renderClusteredDataframe = () => {
        const keys = Object.keys(kmeansData.clustered_dataframe[0]);

        const orderedKeys = ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'];

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
            customdata: kmeansData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => ({ id: row.id })),
            type: 'scatter',
            mode: 'markers',
            name: `Cluster ${cluster}`,
            marker: {
                color: colorMap[cluster],
                size: 7,
                symbol: 'circle',
            },
            hovertemplate: `%{customdata.id}: (%{x}, %{y})<extra>Cluster ${cluster}</extra>`,
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
                title="Intra-Cluster Distances"
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
            <Heatmap 
                xData={clusterLabels}
                yData={clusterLabels}
                zData={kmeansData.inter_cluster_distances.data}
                title="Inter-Cluster Distances Heatmap"
            />
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

    const renderSilhouetteScore = () => {
        return (
            <p>
                <b>Silhouette Score (Overall):</b> {kmeansData.silhouette_score}
            </p>
        );
    };

    return (
        <div>
            <h1>K-Means Clustering</h1>
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
                title="Clustered Dataframe"
                description="This table presents the dataset with an added 'cluster' column, representing the cluster assignment for each data point."
            >
                {renderClusteredDataframe()}
            </DataDescription>

            <DataDescription
                title="PCA Scatter Plot of Clusters"
                description="This scatter plot visualizes the clusters in the reduced-dimensional space using PCA for dimensionality reduction. Each cluster is represented by a unique color."
            >
                {renderScatterPlot()}
            </DataDescription>

            <DataDescription
                title="Cluster Sizes"
                description="This bar chart illustrates the sizes of each cluster, showing the number of data points assigned to each cluster."
            >
                {renderClusterSizes()}
            </DataDescription>

            <DataDescription
                title="Centroids Table"
                description="This table provides the coordinates of the centroids for each cluster in the original feature space, summarizing the central point of each cluster."
            >
                {renderCentroidsTable()}
            </DataDescription>

            <DataDescription
                title="Intra-Cluster Distances"
                description="This bar chart displays the average intra-cluster distance for each cluster, representing the compactness of points within a cluster."
            >
                {renderIntraClusterDistances()}
            </DataDescription>

            <DataDescription
                title="Inter-Cluster Distances Heatmap"
                description="This heatmap shows the distances between cluster centroids, providing insight into the separation and relationships between clusters."
            >
                {renderInterClusterDistances()}
            </DataDescription>

            <DataDescription
                title="Silhouette Score"
                description="The silhouette scores measure the quality of clustering by evaluating how well-separated and compact the clusters are. The bar chart visualizes the silhouette scores for individual points, highlighting their consistency within their respective clusters, while the overall silhouette score provides a single value summarizing the clustering quality across all data points."
            >
                <>
                    {renderSilhouetteScores()}
                    {renderSilhouetteScore()}
                </>
            </DataDescription>
        </div>
    )
}

export default KMeans