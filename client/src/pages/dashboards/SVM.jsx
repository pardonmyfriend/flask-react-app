import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function SVM({ svmData }) {
    const renderDataframe = () => {
        const keys = Object.keys(svmData.dataframe[0]);

        const orderedKeys = ['id', ...keys.filter(key => key !== 'id' && key !== 'original class' && key !== 'predicted class'), 'original class', 'predicted class'];

        const cols = orderedKeys.map(key => ({
            field: key,
            headerName: key.toUpperCase(),
            width: 150,
        }));

        const rows = svmData.dataframe;

        return <DataTable rows={rows} cols={cols} />;
    };

    const renderConfusionMatrix = () => {
        const matrix = svmData.confusion_matrix;
        const classNames = svmData.unique_classes;

        return (
            <ResponsivePlot
                data={[
                    {
                        z: matrix,
                        x: classNames,
                        y: classNames,
                        type: 'heatmap',
                        colorscale: 'RdBu',
                        text: matrix.map(row => row.map(value => value.toFixed(2))),
                        texttemplate: '%{text}',
                    },
                ]}
                layout={{
                    title: 'Confusion Matrix',
                    xaxis: { title: 'Predicted' },
                    yaxis: { title: 'Actual', autorange: 'reversed' },
                }}
            />
        );
    };

    const renderSupportVectors = () => {
        const counts = svmData.support_vector_counts;

        const data = Object.keys(counts).map(className => ({
            x: [className],
            y: [counts[className]],
            type: 'bar',
            name: `Class ${className}`,
        }));

        return (
            <ResponsivePlot
                data={data}
                layout={{
                    title: 'Support Vector Counts per Class',
                    xaxis: { title: 'Class' },
                    yaxis: { title: 'Count' },
                }}
            />
        );
    };

    const renderPCAPlot = () => {
        const uniqueGroups = [...new Set(svmData.pca_dataframe.map(row => row.pred))];
        const data = uniqueGroups.map(group => ({
            x: svmData.pca_dataframe.filter(row => row.pred === group).map(row => row.PC1),
            y: svmData.pca_dataframe.filter(row => row.pred === group).map(row => row.PC2),
            mode: 'markers',
            name: `Class ${group}`,
        }));

        return (
            <ScatterPlot
                data={data}
                title="Predicted Classes Visualized with PCA"
                xTitle="PC1"
                yTitle="PC2"
            />
        );
    };

    return (
        <div>
            {renderDataframe()}
            {renderConfusionMatrix()}
            {renderSupportVectors()}
            {renderPCAPlot()}
        </div>
    );
}

export default SVM;
