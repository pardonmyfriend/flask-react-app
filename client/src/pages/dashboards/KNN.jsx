import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function KNN({ knnData }) {
    const renderDataframe = () => {
        const keys = Object.keys(knnData.dataframe[0]);

        const orderedKeys = ['id', ...keys.filter((key) => key !== 'id' && key !== 'original class' && key !== 'predicted class'), 'original class', 'predicted class']
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        const rows = knnData.dataframe;

        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderAccuracy = () => (
        <div>
            <h3>Accuracy</h3>
            <p>
                {knnData.accuracy}
            </p>
        </div>
    );

    const renderTrueScatterPlot = () => {
        const uniqueGroups = [...new Set(knnData.pca_dataframe.map(row => row.true))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: knnData.pca_dataframe
                .filter(row => row.true === group)
                .map(row => row.PC1),
            y: knnData.pca_dataframe
                .filter(row => row.true === group)
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
                title={'True classes visualized with PCA'}
                xTitle={'PC1'}
                yTitle={'PC2'}
            />
        );
    };

    const renderPredScatterPlot = () => {
        const uniqueGroups = [...new Set(knnData.pca_dataframe.map(row => row.pred))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: knnData.pca_dataframe
                .filter(row => row.pred === group)
                .map(row => row.PC1),
            y: knnData.pca_dataframe
                .filter(row => row.pred === group)
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

        const incorrectPoints = {
            x: knnData.pca_dataframe
                .filter(row => row.pred !== row.true) // Tylko błędne predykcje
                .map(row => row.PC1),
            y: knnData.pca_dataframe
                .filter(row => row.pred !== row.true) // Tylko błędne predykcje
                .map(row => row.PC2),
            type: 'scatter',
            mode: 'markers',
            name: 'Incorrect Predictions',
            marker: {
                color: 'rgba(0,0,0,0)', // Przezroczysty środek
                size: 10,
                symbol: 'circle', // Symbol: okrąg
                line: {
                    color: '#FF0000', // Czerwone obramowanie
                    width: 2, // Szerokość obramowania
                },
            },
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

    const renderConfusionMatrixHeatmap = () => {
        const matrix = knnData.confusion_matrix; // Macierz konfuzji
        const classNames = knnData.unique_classes; // Oryginalne nazwy klas
    
        return (
            <ResponsivePlot
                data={[
                    {
                        z: matrix,
                        x: classNames, // Etykiety klas na osi X
                        y: classNames, // Etykiety klas na osi Y
                        type: 'heatmap',
                        colorscale: 'RdBu',
                        hoverongaps: false,
                        showscale: true,
                        text: matrix.map(row => row.map(value => value.toFixed(2))),
                        texttemplate: '%{text}',
                        textfont: {
                            size: 12,
                            color: '#000000',
                        },
                    },
                ]}
                layout={{
                    title: 'Confusion Matrix',
                    xaxis: {
                        title: 'Predicted Labels',
                        automargin: true,
                    },
                    yaxis: {
                        title: 'True Labels',
                        automargin: true,
                        autorange: 'reversed', // Odwrócenie osi Y
                    },
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                }}
            />
        );
    };
    

    const renderClassificationReport = () => {
        const report = knnData.classification_report;

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
            <div>
                <Typography variant="h6">Classification Report</Typography>
                <DataTable rows={rows} cols={cols} />
            </div>
        );
    };

    const renderROCPlot = () => {
        if (!knnData.roc_data) return null;

        const { fpr, tpr, auc } = knnData.roc_data;
        const data = [
            {
                x: fpr,
                y: tpr,
                type: 'scatter',
                mode: 'lines',
                name: `AUC = ${auc.toFixed(2)}`,
            },
        ];

        return (
            <ResponsivePlot
                data={data}
                layout={{
                    title: 'ROC Curve',
                    xaxis: { title: 'False Positive Rate' },
                    yaxis: { title: 'True Positive Rate' },
                }}
                config={{ responsive: true }}
            />
        );
    };

    const renderPRPlot = () => {
        if (!knnData.pr_data) return null;

        const { precision, recall } = knnData.pr_data;
        const data = [
            {
                x: recall,
                y: precision,
                type: 'scatter',
                mode: 'lines',
                name: 'PR Curve',
            },
        ];

        return (
            <ResponsivePlot
                data={data}
                layout={{
                    title: 'Precision-Recall Curve',
                    xaxis: { title: 'Recall' },
                    yaxis: { title: 'Precision' },
                }}
                config={{ responsive: true }}
            />
        );
    };

    return (
        <div>
            {renderDataframe()}
            {renderTrueScatterPlot()}
            {renderPredScatterPlot()}
            {renderAccuracy()}
            {renderConfusionMatrixHeatmap()}
            {renderClassificationReport()}
            {renderROCPlot()}
            {renderPRPlot()}
        </div>
    );
}

export default KNN