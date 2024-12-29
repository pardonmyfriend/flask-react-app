import React from 'react'
import { Typography } from '@mui/material';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import BarPlotGroup from '../../components/plots/BarPlotGroup';
import BarPlot from '../../components/plots/BarPlot';
import Heatmap from '../../components/plots/Heatmap';
import DataDescription from '../../components/plots/DataDescription';

function DecisionTree({ treeData, params }) {
    const renderDataframe = () => {
        const keys = Object.keys(treeData.dataframe[0]);

        const orderedKeys = ['id', ...keys.filter((key) => key !== 'id' && key !== 'original class' && key !== 'predicted class'), 'original class', 'predicted class']
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(keys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = treeData.dataframe;

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        const uniqueGroups = [...new Set(treeData.pca_dataframe.map(row => row.pred))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: treeData.pca_dataframe
                .filter(row => row.pred === group)
                .map(row => row.PC1),
            y: treeData.pca_dataframe
                .filter(row => row.pred === group)
                .map(row => row.PC2),
            customdata: treeData.pca_dataframe
                .filter(row => row.pred === group)
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

        const incorrectPoints = {
            x: treeData.pca_dataframe
                .filter(row => row.pred !== row.true)
                .map(row => row.PC1),
            y: treeData.pca_dataframe
                .filter(row => row.pred !== row.true)
                .map(row => row.PC2),
            customdata: treeData.pca_dataframe
                .filter(row => row.pred !== row.true)
                .map(row => ({ true: row.true, pred: row.pred })),
            type: 'scatter',
            mode: 'markers',
            name: 'Incorrect Predictions',
            marker: {
                color: 'rgba(0,0,0,0)',
                size: 10,
                symbol: 'circle',
                line: {
                    color: '#FF0000',
                    width: 2,
                },
            },
            hovertemplate: 'True: %{customdata.true}<br>Predicted: %{customdata.pred}<extra></extra>',
        };

        return (
            <ScatterPlot
                data={[...data, incorrectPoints]}
                title={'Predicted classes visualized with PCA'}
                xTitle={'PC1'}
                yTitle={'PC2'}
            />
        );
    };

    const renderClassDistributionBarplot = () => {
        const trainClasses = Object.keys(treeData.train_class_distribution);
        const trainCounts = Object.values(treeData.train_class_distribution);
        const testCounts = Object.values(treeData.test_class_distribution);
    
        return (
            <BarPlotGroup
                xData={trainClasses}
                yData1={trainCounts}
                yData2={testCounts}
            />
        );
    };

    const renderTree = () => {
        const calculateNodePositions = () => {
            const positions = {};
            const levelWidths = {};
        
            const traverse = (nodeId, depth) => {
                if (!levelWidths[depth]) levelWidths[depth] = 0;
        
                const children = treeData.tree_structure.edges
                    .filter(edge => edge.source === nodeId)
                    .map(edge => edge.target);
        
                let xPos;
                if (children.length > 0) {
                    const childPositions = children.map(childId => traverse(childId, depth + 1));
        
                    xPos = (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
                } else {
                    xPos = levelWidths[depth];
                    levelWidths[depth] += 1;
                }
        
                positions[nodeId] = { x: xPos, y: -depth };
                return xPos;
            };
        
            traverse(0, 0);
            return positions;
        };
        
    
        const positions = calculateNodePositions();

        const allX = Object.values(positions).map(pos => pos.x);
        const xMin = Math.min(...allX);
        const xMax = Math.max(...allX);
        const margin = 1; // Dodaj margines na tekst

        const getTextPosition = (nodeId) => {
            const parentEdge = treeData.tree_structure.edges.find(edge => edge.target === nodeId);
            if (!parentEdge) return "top"; // Korzeń drzewa
            
            const parentX = positions[parentEdge.source].x;
            const currentX = positions[nodeId].x;
    
            return currentX < parentX ? "top left" : "top right"; // Jeśli na lewo od rodzica, tekst z lewej
        };
    
        const nodes = treeData.tree_structure.nodes.map(node => ({
            x: [positions[node.id].x],
            y: [positions[node.id].y],
            text: node.feature !== null
                ? `<b>${treeData.feature_names[node.feature]}</b>≥ ${node.threshold.toFixed(2)}`
                : `<b>${treeData.unique_classes[node.value.indexOf(Math.max(...node.value))]}</b>`,
            mode: "markers+text",
            textposition: node.feature !== null ? getTextPosition(node.id) : "bottom",
            hoverinfo: "text",
            marker: { size: 10 },
        }));
    
        const edges = treeData.tree_structure.edges.map(edge => ({
            x: [positions[edge.source].x, positions[edge.target].x],
            y: [positions[edge.source].y, positions[edge.target].y],
            mode: "lines",
            line: { color: "gray" },
            hoverinfo: "none"
        }));
    
        return (
            <ResponsivePlot
                data={[...nodes, ...edges]}
                layout={{
                    title: "Decision Tree Visualization",
                    xaxis: { showgrid: false, zeroline: false, visible: false, range: [xMin - margin, xMax + margin] },
                    yaxis: { showgrid: false, zeroline: false, visible: false },
                    showlegend: false,
                }}
                bigger={true}
            />
        );
    };

    const renderFeatureImportance = () => {
        const featureNames = treeData.feature_names;

        return (
                <BarPlot 
                    xData={featureNames}
                    yData={treeData.feature_importances}
                    title="Feature Importance"
                    xTitle="Features"
                    yTitle="Importance"
                />
        );
    };

    const renderPerformanceMetrics = () => {
        const cols = [
            { field: 'Metric', headerName: 'Metric', flex: 1 },
            { field: 'Value', headerName: 'Value', flex: 1 },
        ];

        const rows = treeData.summary_df.map((item, index) => ({
            id: index,
            Metric: item.Metric,
            Value: item.Value,
        }));

        return (
            <DataPresentation
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderConfusionMatrix = () => {
        const matrix = treeData.confusion_matrix;
        const classNames = treeData.unique_classes;
    
        return (
            <Heatmap 
                xData={classNames}
                yData={classNames}
                zData={matrix}
                title="Confusion Matrix"
                xTitle={"Predicted"}
                yTitle={"Actual"}
            />
        );
    };
    

    const renderClassificationReport = () => {
        const report = treeData.classification_report;

        const rows = Object.keys(report).filter(key => key !== "accuracy").map((key) => ({
            id: key,
            ...report[key],
        }));

        const cols = [
            { field: 'id', headerName: 'Class', flex: 1 },
            { field: 'precision', headerName: 'Precision', flex: 1 },
            { field: 'recall', headerName: 'Recall', flex: 1 },
            { field: 'f1-score', headerName: 'F1-Score', flex: 1 },
            { field: 'support', headerName: 'Support', flex: 1 },
        ];

        return (
            <DataPresentation 
                rows={rows} 
                cols={cols} 
            />
        );
    };

    return (
        <div>
            <h1>Decision Tree Classification</h1>
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
                title="Dataset with Predictions"
                description="This table presents the dataset with added 'original class' and 'predicted class' columns, allowing for comparison of actual and predicted labels for each data point."
            >
                {renderDataframe()}
            </DataDescription>

            <DataDescription
                title="PCA Scatter Plot of Predictions"
                description="This scatter plot visualizes the predicted classes in a reduced-dimensional space using PCA for dimensionality reduction. Points with incorrect predictions are highlighted with red outlines."
            >
                {renderScatterPlot()}
            </DataDescription>

            <DataDescription
                title="Class Distribution Bar Plot"
                description="This grouped bar chart illustrates the distribution of classes in the training and test datasets, enabling a comparison of the class balance across these datasets."
            >
                {renderClassDistributionBarplot()}
            </DataDescription>

            <DataDescription
                title="Decision Tree Visualization"
                description="This interactive visualization shows the structure of the decision tree, illustrating the decision-making process at each split based on feature thresholds. Each leaf node represents a class prediction."
            >
                {renderTree()}
            </DataDescription>

            <DataDescription
                title="Feature Importance"
                description="This bar chart highlights the importance of each feature in the decision-making process of the tree. Features with higher values contributed more to the splits."
            >
                {renderFeatureImportance()}
            </DataDescription>

            <DataDescription
                title="Performance Metrics"
                description="This table summarizes key performance metrics for the Decision Tree classifier, providing an overview of its accuracy and efficiency."
            >
                {renderPerformanceMetrics()}
            </DataDescription>

            <DataDescription
                title="Confusion Matrix"
                description="This heatmap displays the confusion matrix for the Decision Tree classifier, illustrating the relationship between true labels and predicted labels across all classes."
            >
                {renderConfusionMatrix()}
            </DataDescription>

            <DataDescription
                title="Classification Report"
                description="This table provides detailed metrics for each class, including precision, recall, F1-score, and support, enabling an in-depth analysis of the classifier's performance for individual classes."
            >
                {renderClassificationReport()}
            </DataDescription>
        </div>
    );
}

export default DecisionTree