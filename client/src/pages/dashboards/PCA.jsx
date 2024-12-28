import React from "react";
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import ScatterPlot3D from "../../components/plots/ScatterPlot3D";
import DataDescription from "../../components/plots/DataDescription";
import Heatmap from "../../components/plots/Heatmap";

function PCA({ pcaData, target }) {
    const renderPCADataframe = () => {
        const keys = Object.keys(pcaData.pca_components[0]);

        const orderedKeys = keys.includes(target) 
        ? ['id', ...keys.filter((key) => key !== 'id' && key !== target), target] 
        : ['id', ...keys.filter((key) => key !== 'id')];
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = pcaData.pca_components;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const keys = Object.keys(pcaData.pca_components[0]);
    const pcKeys = keys.filter(key => key.startsWith('PC'));
    const numComponents = pcKeys.length;

    const renderScatterPlot = () => {
        const uniqueGroups = [...new Set(pcaData.pca_components.map(row => row[target]))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        if (numComponents === 3) {
            const data = uniqueGroups.map(group => ({
                x: pcaData.pca_components
                    .filter(row => row[target] === group)
                    .map(row => row.PC1),
                y: pcaData.pca_components
                    .filter(row => row[target] === group)
                    .map(row => row.PC2),
                z: pcaData.pca_components
                    .filter(row => row[target] === group)
                    .map(row => row.PC3),
                type: 'scatter3d',
                mode: 'markers',
                name: group,
                marker: {
                    color: colorMap[group],
                    size: 5,
                    symbol: 'circle',
                },
            }));
    
            return (
                <ScatterPlot3D
                    data={data}
                    title={'PCA Scatter Plot'}
                    xTitle={'PC1'}
                    yTitle={'PC2'}
                    zTitle={'PC3'}
                />
            );
        } else {
            const data = uniqueGroups.map(group => ({
                x: pcaData.pca_components
                    .filter(row => row[target] === group)
                    .map(row => row.PC1),
                y: pcaData.pca_components
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
                    title={'PCA Scatter Plot'}
                    xTitle={'PC1'}
                    yTitle={'PC2'}
                />
            );
        }
    };

    const renderCorrelationHeatmap = () => {
        const correlationMatrix = pcaData.correlation_matrix;
        const variables = Object.keys(correlationMatrix);
        const components = Object.keys(correlationMatrix[variables[0]]);

        const zValues = variables.map(variable =>
            components.map(component => correlationMatrix[variable][component])
        );

        return (
            <Heatmap 
                xData={components}
                yData={variables}
                zData={zValues}
                title={'Correlation Matrix'}
                xTitle={'Principal Components'}
                yTitle={'Original Variables'}
            />
        );
    };

    const renderEigenValuesData = () => {
        const rows = pcaData.eigen_values_data;

        const cols = [
            { field: 'id', headerName: 'Principal Component', flex: 1 },
            { field: 'eigenvalue', headerName: 'Eigenvalue', flex: 1 },
            { field: '% of total variance', headerName: '% of Total Variance', flex: 1 },
            { field: 'cumulative eigenvalue', headerName: 'Cumulative Eigenvalue', flex: 1 },
            { field: 'cumulative %', headerName: 'Cumulative %', flex: 1 },
        ];

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderExplainedVariancePlot = () => {
        return (
            <ResponsivePlot
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
                    },
                ]}
                layout={{
                    autosize: true,
                    title: 'Explained Variance',
                    xaxis: {
                        title: 'Principal component',
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
                    },
                    yaxis: {
                        title: 'Explained variance (%)',
                        automargin: true,
                        showgrid: true,
                        zeroline: false,
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

    return (
        <div>
            <DataDescription
                title="Reduced Data"
                description="This table presents the input data transformed by PCA. Each row corresponds to a data point with new coordinates along the principal components, which are linear combinations of the original variables."
            >
                {renderPCADataframe()}
            </DataDescription>

            {numComponents <= 3 && 
                <DataDescription
                    title="PCA Scatter Plot"
                    description="This scatter plot visualizes the distribution of the dataset projected onto first two (or three) principal components."
                >
                    {renderScatterPlot()}
                </DataDescription>
            }

            <DataDescription
                title="Correlation matrix"
                description="This heatmap illustrates the correlation between the original variables and the principal components, enabling analysis of each variable's contribution to the components."
            >
                {renderCorrelationHeatmap()}
            </DataDescription>

            <DataDescription
                title="Eigenvalues and Variance"
                description="This table provides information about eigenvalues, the percentage of variance explained, and cumulative values for each principal component."
            >
                {renderEigenValuesData()}
            </DataDescription>

            <DataDescription
                title="Explained Variance Plot"
                description="This plot shows the percentage of variance explained by each principal component, helping to evaluate how much information each component retains."
            >
                {renderExplainedVariancePlot()}
            </DataDescription>
        </div>
    )
}

export default PCA