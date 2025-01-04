import React from "react";
import { Typography } from "@mui/material";
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import ScatterPlot from "../../components/plots/ScatterPlot";
import DataPresentation from "../../components/plots/DataPresentation";
import BarPlot from "../../components/plots/BarPlot";
import Heatmap from "../../components/plots/Heatmap";
import DataDescription from "../../components/plots/DataDescription";

function AgglomerativeClustering({ aggData, params }) {
    const renderAggDataframe = () => {
        const keys = Object.keys(aggData.cluster_dataframe[0]);
        
        const orderedKeys = ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = aggData.cluster_dataframe;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        const uniqueClusters = [...new Set(aggData.pca_dataframe.map(row => row.cluster))];
        const colorMap = uniqueClusters.reduce((map, cluster, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[cluster] = colors[index % colors.length];
            return map;
        }, {});

        const data = uniqueClusters.map(cluster => ({
            x: aggData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row.PC1),
            y: aggData.pca_dataframe
                .filter(row => row.cluster === cluster)
                .map(row => row.PC2),
            customdata: aggData.pca_dataframe
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
        const clusters = Object.keys(aggData.cluster_sizes);
        const clusterCounts = Object.values(aggData.cluster_sizes);
    
        const mappedClusters = clusters.map((cluster) => `Cluster ${cluster}`);
    
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
    
    const renderDendrogram = () => {
        const dendro = aggData.dendrogram_data;

        const threshold = aggData.threshold || 0;

        const filteredIcoord = dendro.icoord.filter((icoord, idx) => {
            const dcoord = dendro.dcoord[idx];
            return !(dcoord.every((y) => y === 0));
        });

        const filtredColors = dendro.color_list.filter((color, idx) => {
            const dcoord = dendro.dcoord[idx];
            return !(dcoord.every((y) => y === 0));
        });
        
        const filteredDcoord = dendro.dcoord.filter((dcoord) => {
            return !(dcoord.every((y) => y === 0));
        });

        const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];

        const uniqueColors = Array.from(new Set(filtredColors));
        const colorMapping = {};
        uniqueColors.forEach((color, index) => {
            if (color === 'C0') {
                colorMapping[color] = '#808080';
            } else {
                colorMapping[color] = colors[index % colors.length];
            }
        });

        const leafPositions = [];

        filteredIcoord.forEach((icoord, idx) => {
            const dcoord = filteredDcoord[idx];

            if (dcoord[0] === 0) {
                leafPositions.push(icoord[0]);
            }
        
            if (dcoord[3] === 0) {
                leafPositions.push(icoord[3]);
            }
        });

        const sortedLeafPositions = [...leafPositions].sort((a, b) => a - b);
    
        const data = filteredIcoord.map((icoord, i) => ({
            x: icoord,
            y: filteredDcoord[i],
            type: "scatter",
            mode: "lines",
            line: { color: colorMapping[filtredColors[i]] || "#000000" },
            hoverinfo: "none",
        }));

        const tickvals = sortedLeafPositions;
        const ticktext = dendro.ivl;

        const shapes = threshold > 0 ? [
            {
                type: "line",
                x0: Math.min(...sortedLeafPositions),
                x1: Math.max(...sortedLeafPositions),
                y0: threshold,
                y1: threshold,
                line: {
                    color: "black",
                    width: 1,
                    dash: "dashdot",
                },
            },
        ] : [];
    
        return (
            <ResponsivePlot
                data={data}
                layout={{
                    title: "Dendrogram",
                    autosize: false,
                    xaxis: {
                        title: "Leaf Index",
                        tickvals: tickvals,
                        ticktext: ticktext,
                        tickmode: "array",
                        tickfont: { size: 5 },
                    },
                    yaxis: {
                        title: "Distance",
                    },
                    shapes: shapes,
                    showlegend: false,
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false
                }}
            />
        );
    };

    const renderIntraClusterDistances = () => {
        const clusters = aggData.intra_cluster_distances.map(item => item.cluster);
        const distances = aggData.intra_cluster_distances.map(item => item['intra-cluster distance']);
        
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
        const clusterLabels = aggData.inter_cluster_distances.index.map(
            (label) => ( `Cluster ${label}`)
        );
    
        return (
            <Heatmap 
                xData={clusterLabels}
                yData={clusterLabels}
                zData={aggData.inter_cluster_distances.data}
                title="Inter-Cluster Distances Heatmap"
            />
        );
    };
    
    const renderSilhouetteScores = () => {
        return (
            <BarPlot 
                xData={aggData.pca_dataframe.map(row => row.id)}
                yData={aggData.pca_dataframe.map(row => row.silhouette_score)}
                title="Silhouette Scores for Each Point"
                xTitle="Point Index"
                yTitle="Silhouette Score"
                linear={false}
            />
        );
    };

    const renderSilhouetteScore = () => (
        <p>
            <b>Silhouette Score (Overall):</b> {aggData.silhouette_score}
        </p>
    );

    return (
        <div>
            <h1>Agglomerative Clustering</h1>
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
                {renderAggDataframe()}
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
                title="Dendrogram"
                description="This dendrogram represents the hierarchical structure of the clusters, showing how clusters are merged at different levels of distance. A threshold line, if present, indicates the cut-off point for defining clusters."
            >
                {renderDendrogram()}
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
                title="Silhouette Scores"
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

export default AgglomerativeClustering;
