import React from 'react';
import { Typography } from '@mui/material';
import DataPresentation from "../../components/plots/DataPresentation";
import ScatterPlot from "../../components/plots/ScatterPlot";
import BarPlotGroup from '../../components/plots/BarPlotGroup';
import BarPlot from '../../components/plots/BarPlot';
import Heatmap from '../../components/plots/Heatmap';
import DataDescription from '../../components/plots/DataDescription';

function SVM({ svmData, params }) {
    const renderDataframe = () => {
        const keys = Object.keys(svmData.dataframe[0]);

        const orderedKeys = ['id', ...keys.filter(key => key !== 'id' && key !== 'original class' && key !== 'predicted class'), 'original class', 'predicted class'];

        const cols = orderedKeys.map(key => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(keys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = svmData.dataframe;

        return <DataPresentation 
            rows={rows} 
            cols={cols} 
        />;
    };

    const renderScatterPlot = () => {
        const uniqueGroups = [...new Set(svmData.pca_dataframe.map(row => row.pred))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: svmData.pca_dataframe
                .filter(row => row.pred === group)
                .map(row => row.PC1),
            y: svmData.pca_dataframe
                .filter(row => row.pred === group)
                .map(row => row.PC2),
            customdata: svmData.pca_dataframe
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
            x: svmData.pca_dataframe
                .filter(row => row.pred !== row.true)
                .map(row => row.PC1),
            y: svmData.pca_dataframe
                .filter(row => row.pred !== row.true)
                .map(row => row.PC2),
            customdata: svmData.pca_dataframe
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
                title={'Predicted Classes Visualized with PCA'}
                xTitle={'PC1'}
                yTitle={'PC2'}
            />
        );
    };

    const renderClassDistributionBarplot = () => {
        const trainClasses = Object.keys(svmData.train_class_distribution);
        const trainCounts = Object.values(svmData.train_class_distribution);
        const testCounts = Object.values(svmData.test_class_distribution);
    
        return (
            <BarPlotGroup
                xData={trainClasses}
                yData1={trainCounts}
                yData2={testCounts}
                title={'Class Distribution in Train and Test Sets'}
                name1={'Train Set'}
                name2={'Test Set'}
                xTitle={'Class'}
                yTitle={'Count'}
            />
        );
    };

    const renderSupportVectors = () => {
        const classes = Object.keys(svmData.support_vector_counts)
        const counts = Object.values(svmData.support_vector_counts)

        return (
            <BarPlot 
                xData={classes}
                yData={counts}
                title="Support Vector Counts per Class"
                xTitle="Class"
                yTitle="Count"
            />
        );
    };

    const renderPerformanceMetrics = () => {
        const cols = [
            { field: 'Metric', headerName: 'Metric', flex: 1 },
            { field: 'Value', headerName: 'Value', flex: 1 },
        ];

        const rows = svmData.summary_df.map((item, index) => ({
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
        const matrix = svmData.confusion_matrix;
        const classNames = svmData.unique_classes;
    
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
        const report = svmData.classification_report;

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
            <h1>SVM Classification</h1>
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
                title="Support Vector Counts"
                description="This bar chart shows the number of support vectors for each class, providing insights into the complexity of the model and the influence of individual classes on the decision boundary."
            >
                {renderSupportVectors()}
            </DataDescription>

            <DataDescription
                title="Performance Metrics"
                description="This table summarizes key performance metrics for the SVM classifier, providing an overview of its accuracy and efficiency."
            >
                {renderPerformanceMetrics()}
            </DataDescription>

            <DataDescription
                title="Confusion Matrix"
                description="This heatmap displays the confusion matrix for the SVM classifier, illustrating the relationship between true labels and predicted labels across all classes."
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

export default SVM;
