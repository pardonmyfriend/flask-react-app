import React from "react";
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function DBSCAN({ dbscanData }) {
    const renderDBSCANDataframe = () => {
        const keys = Object.keys(dbscanData.cluster_dataframe[0]);
        
        const orderedKeys = keys.includes('id') 
            ? ['id', ...keys.filter((key) => key !== 'id' && key !== 'cluster'), 'cluster'] 
            : [...keys.filter((key) => key !== 'cluster'), 'cluster'];

        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        const rows = dbscanData.cluster_dataframe;

        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
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

    const renderBarPlot = () => {
        const clusters = Object.keys(dbscanData.cluster_sizes);
        const clusterCounts = Object.values(dbscanData.cluster_sizes);
    
        const mappedClusters = clusters.map((cluster) => 
            cluster === "Noise" ? "Noise" : `Cluster ${cluster}`
        );
    
        const data = [
            {
                x: mappedClusters,
                y: clusterCounts,
                type: "bar",
                name: "Cluster sizes",
                marker: {
                    color: "#3FBDBD",
                },
            },
        ];
    
        return (
            <ResponsivePlot
                data={data}
                layout={{
                    autosize: true,
                    title: "Cluster Sizes",
                    xaxis: {
                        title: "Cluster",
                        automargin: true,
                        showgrid: false,
                        tickmode: "linear",
                    },
                    yaxis: {
                        title: "Number of Points",
                        automargin: true,
                        showgrid: true,
                    },
                    hovermode: "closest",
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                }}
            />
        );
    };

    const renderHeatmap = () => {
        const clusterLabels = dbscanData.inter_cluster_distances.index.map(
            (label) => (label === "Noise" ? "Noise" : `Cluster ${label}`)
        );
    
        return (
            <ResponsivePlot
                data={[
                    {
                        z: dbscanData.inter_cluster_distances.data,
                        x: clusterLabels,
                        y: clusterLabels,
                        type: "heatmap",
                        colorscale: "RdBu",
                        text: dbscanData.inter_cluster_distances.data.map(row => row.map(value => value.toFixed(2))),
                        hoverinfo: "text",
                    },
                ]}
                layout={{
                    title: "Inter-Cluster Distances Heatmap",
                    annotations: dbscanData.inter_cluster_distances.data.flatMap((row, i) =>
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

    const renderIntraClusterDistances = () => {
        const clusters = dbscanData.intra_cluster_distances.map(item => item.cluster);
        const distances = dbscanData.intra_cluster_distances.map(item => item['intra-cluster distance']);
    
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
            <ResponsivePlot
                data={data}
                layout={{
                    autosize: true,
                    title: "Intra-cluster Distances",
                    xaxis: {
                        title: "Cluster",
                        automargin: true,
                        showgrid: false,
                        tickmode: "linear",
                    },
                    yaxis: {
                        title: "Average Distance",
                        automargin: true,
                        showgrid: true,
                    },
                    hovermode: "closest",
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                }}
            />
        );
    };

    const renderCentroidsTable = () => {
        const keys = Object.keys(dbscanData.centroids[0]);

        const orderedKeys = keys.includes('id') 
            ? ['id', 'cluster', ...keys.filter((key) => key !== 'id' && key !== 'cluster')] 
            : ['cluster', ...keys.filter((key) => key !== 'cluster')];

        const cols = orderedKeys.map(key => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        const rows = dbscanData.centroids;
    
        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderSilhouetteScores = () => (
        <ResponsivePlot
            data={[
                {
                    x: dbscanData.pca_dataframe.map(row => row.id),
                    y: dbscanData.pca_dataframe.map(row => row.silhouette_score),
                    type: "bar",
                    marker: { color: "#3FBDBD" },
                },
            ]}
            layout={{
                title: "Silhouette Scores for Each Point",
                xaxis: { title: "Point Index" },
                yaxis: { title: "Silhouette Score" },
            }}
            config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
            }}
        />
    );

    const renderSilhouetteScore = () => (
        <div>
            <h3>Silhouette Score (Overall):</h3>
            <p>
                {dbscanData.silhouette_score}
            </p>
        </div>
    );

    return (
        <div>
            {renderDBSCANDataframe()}
            {renderScatterPlot()}
            {renderBarPlot()}
            {renderCentroidsTable()}
            {renderSilhouetteScore()}
            {renderSilhouetteScores()}
            {renderIntraClusterDistances()}
            {renderHeatmap()}
        </div>
    );
}

export default DBSCAN;
