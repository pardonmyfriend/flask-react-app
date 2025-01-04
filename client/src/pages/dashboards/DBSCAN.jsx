import React from "react";
import { Alert, Typography } from "@mui/material";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import BarPlot from "../../components/plots/BarPlot";
import Heatmap from "../../components/plots/Heatmap";
import DataDescription from "../../components/plots/DataDescription";

function DBSCAN({ dbscanData, params }) {
    const isEmptyData = (data) => !data || data.length === 0;

    const renderDBSCANDataframe = () => {
        if (!dbscanData.cluster_dataframe) return (
            <Alert severity="info">
                No data available for this section.
            </Alert>
        );

        const keys = Object.keys(dbscanData.cluster_dataframe[0]);
        
        const orderedKeys = ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = dbscanData.cluster_dataframe;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        if (!dbscanData.pca_dataframe) return (
            <Alert severity="info">
                No data available for this section.
            </Alert>
        );

        const uniqueClusters = [...new Set(dbscanData.pca_dataframe.map(row => row.cluster))];
        const colorMap = uniqueClusters.reduce((map, cluster, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[cluster] = colors[index % colors.length];
            return map;
        }, {});

        const data = uniqueClusters.map(cluster => ({
            x: dbscanData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row.PC1),
            y: dbscanData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row.PC2),
            customdata: dbscanData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => ({ id: row.id })),
            type: 'scatter',
            mode: 'markers',
            name: cluster === "Noise" ? "Noise" : `Cluster ${cluster}`,
            marker: {
                color: colorMap[cluster],
                size: 7,
                symbol: 'circle',
            },
            hovertemplate: `%{customdata.id}: (%{x}, %{y})<extra>${cluster === "Noise" ? "Noise" : `Cluster ${cluster}`}</extra>`,

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
        if (!dbscanData.cluster_sizes) return (
            <Alert severity="info">
                No data available for this section.
            </Alert>
        );

        const clusters = Object.keys(dbscanData.cluster_sizes);
        const clusterCounts = Object.values(dbscanData.cluster_sizes);
    
        const mappedClusters = clusters.map((cluster) => 
            cluster === "Noise" ? "Noise" : `Cluster ${cluster}`
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

    const renderIntraClusterDistances = () => {
        if (isEmptyData(dbscanData.intra_cluster_distances)) {
            return (
                <Alert severity="info">
                    No data available for this section.
                </Alert>
            );
        }

        const clusters = dbscanData.intra_cluster_distances.map(item => item.cluster);
        const distances = dbscanData.intra_cluster_distances.map(item => item['intra-cluster distance']);

        const mappedClusters = clusters.map((cluster) => 
            `Cluster ${cluster}`
        );
    
        const data = [
            {
                x: clusters,
                y: distances,
                type: "bar",
                name: "Intra-cluster Distances",
                marker: {
                    color: "#3FBDBD",
                },
            },
        ];
    
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
        const distances = dbscanData.inter_cluster_distances;
        
        if (
            !distances ||
            !distances.index || distances.index.length === 0 ||
            !distances.columns || distances.columns.length === 0 ||
            !distances.data || distances.data.length === 0
        ) {
            return (
                <Alert severity="info">
                    No data available for this section.
                </Alert>
            );
        }

        const clusterLabels = dbscanData.inter_cluster_distances.index.map(
            (label) => (label === "Noise" ? "Noise" : `Cluster ${label}`)
        );
    
        return (
            <Heatmap 
                xData={clusterLabels}
                yData={clusterLabels}
                zData={dbscanData.inter_cluster_distances.data}
                title="Inter-Cluster Distances Heatmap"
            />
        );
    };

    const renderSilhouetteScores = () => {
        if (isEmptyData(dbscanData.pca_dataframe)) {
            return (
                <Alert severity="info">
                    No data available for this section.
                </Alert>
            );
        }

        if (!dbscanData.pca_dataframe.some(row => 'silhouette_score' in row)) {
            return (
                <Alert severity="info">
                    No data available for this section.
                </Alert>
            );
        }

        return (
            <BarPlot 
                xData={dbscanData.pca_dataframe.map(row => row.id)}
                yData={dbscanData.pca_dataframe.map(row => row.silhouette_score)}
                title="Silhouette Scores for Each Point"
                xTitle="Point Index"
                yTitle="Silhouette Score"
                linear={false}
            />
        );
    };

    const renderSilhouetteScore = () => {
        if (!dbscanData.silhouette_score || dbscanData.silhouette_score === "Not Applicable") {
            return (
                null
            )
        }

        return (
            <p>
                <b>Silhouette Score (Overall):</b> {dbscanData.silhouette_score}
            </p>
        );
    };

    return (
        <div>
            <h1>DBSCAN Clustering</h1>
            <DataDescription
                title={'Parameters'}
                notExpanded={true}
            >
                <Typography 
                    variant="body1" 
                    sx={{ textAlign: 'left' }} // Wyrównanie tylko dla tego przypadku
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
                description="This table displays the dataset with a 'cluster' column indicating the cluster assignment for each data point. Points marked as 'Noise' were not assigned to any cluster due to their low density."
            >
                {renderDBSCANDataframe()}
            </DataDescription>

            <DataDescription
                title="PCA Scatter Plot of Clusters"
                description="This scatter plot visualizes the clusters in the reduced-dimensional space using PCA for dimensionality reduction. Noise points are displayed alongside identified clusters."
            >
                {renderScatterPlot()}
            </DataDescription>

            <DataDescription
                title="Cluster Sizes"
                description="This bar chart illustrates the sizes of each cluster, showing the number of data points in each cluster. A separate bar is displayed for points categorized as 'Noise'."
            >
                {renderClusterSizes()}
            </DataDescription>

            <DataDescription
                title="Intra-Cluster Distances"
                description="This bar chart displays the average intra-cluster distance for each cluster, indicating how compact each cluster is. Noise points are not included in this analysis."
            >
                {renderIntraClusterDistances()}
            </DataDescription>

            <DataDescription
                title="Inter-Cluster Distances Heatmap"
                description="This heatmap shows the distances between cluster centroids, illustrating the separation between clusters. Noise points are not included in this analysis."
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
    );
}

export default DBSCAN;
