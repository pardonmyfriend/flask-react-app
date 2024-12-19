import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tree from 'react-d3-tree';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function DecisionTree({ treeData }) {
    const renderDataframe = () => {
        const keys = Object.keys(treeData.dataframe[0]);

        const orderedKeys = ['id', ...keys.filter((key) => key !== 'id' && key !== 'original class' && key !== 'predicted class'), 'original class', 'predicted class']
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            flex: 1,
        }));

        const rows = treeData.dataframe;

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
                {treeData.accuracy}
            </p>
        </div>
    );

    const renderTrueScatterPlot = () => {
        const uniqueGroups = [...new Set(treeData.pca_dataframe.map(row => row.true))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: treeData.pca_dataframe
                .filter(row => row.true === group)
                .map(row => row.PC1),
            y: treeData.pca_dataframe
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
            x: treeData.pca_dataframe
                .filter(row => row.pred !== row.true) // Tylko błędne predykcje
                .map(row => row.PC1),
            y: treeData.pca_dataframe
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
        const matrix = treeData.confusion_matrix; // Macierz konfuzji
        const classNames = treeData.unique_classes; // Oryginalne nazwy klas
    
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
            <div>
                <Typography variant="h6">Classification Report</Typography>
                <DataTable rows={rows} cols={cols} />
            </div>
        );
    };

    const renderROCPlot = () => {
        if (!treeData.roc_data) return null;

        const { fpr, tpr, auc } = treeData.roc_data;
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
        if (!treeData.pr_data) return null;

        const { precision, recall } = treeData.pr_data;
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

    const renderFeatureImportance = () => {
        const data = [
            {
                x: treeData.feature_importances,
                y: treeData.feature_importances.map((_, index) => `Feature ${index + 1}`),
                type: 'bar',
                orientation: 'h',
                marker: {
                    color: 'rgba(75, 192, 192, 0.6)'
                }
            }
        ];

        return (
            <ResponsivePlot
                data={data}
                layout={{
                    title: 'Feature Importance',
                    xaxis: { title: 'Importance' },
                    yaxis: { title: 'Features' }
                }}
            />
        );
    };

    const renderPerformanceMetrics = () => {
        const cols = [
            { field: 'Metric', headerName: 'Metric', flex: 1 },
            { field: 'Value', headerName: 'Value', flex: 1 },
        ];

        // Convert rows from treeData.summary_dataframe
        const rows = treeData.summary_df.map((item, index) => ({
            id: index, // Add a unique id for DataGrid
            Metric: item.Metric,
            Value: item.Value,
        }));

        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    // const renderTree = () => {
    //     const nodes = treeData.tree_structure.nodes.map((node) => ({
    //         x: [node.id],
    //         y: [node.samples],
    //         text: node.feature !== null 
    //           ? `<b>${treeData.feature_names[node.feature]}</b><br>≥ ${node.threshold.toFixed(2)}` 
    //           : `<b>${treeData.unique_classes[node.value.indexOf(Math.max(...node.value))]}</b>`,
    //         mode: "markers+text",
    //         textposition: "right",
    //         hoverinfo: "text",
    //       }));
        
    //       const edges = treeData.tree_structure.edges.map((edge) => ({
    //         x: [edge.source, edge.target],
    //         y: [treeData.tree_structure.nodes[edge.source].samples, treeData.tree_structure.nodes[edge.target].samples],
    //         mode: "lines",
    //         line: { color: "gray" },
    //       }));

    //       return (
    //         <ResponsivePlot
    //           data={[...nodes, ...edges]}
    //           layout={{
    //             title: "Decision Tree Visualization",
    //             xaxis: { showgrid: false, zeroline: false, visible: false },
    //             yaxis: { showgrid: false, zeroline: false, visible: false },
    //             showlegend: false,
    //           }}
    //           bigger={true}
    //         />
    //       );
    // };

    const renderTree = () => {
        // const calculateNodePositions = () => {
        //     const positions = {};
        //     const levelWidths = {};
    
        //     const traverse = (nodeId, depth, xOffset) => {
        //         if (!levelWidths[depth]) levelWidths[depth] = 0;
    
        //         let xPos = xOffset;
        //         const children = treeData.tree_structure.edges
        //             .filter(edge => edge.source === nodeId)
        //             .map(edge => edge.target);
    
        //         if (children.length > 0) {
        //             const childPositions = children.map((childId, index) =>
        //                 traverse(childId, depth + 1, xOffset + index)
        //             );
    
        //             xPos = (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
        //         }
    
        //         positions[nodeId] = { x: xPos, y: -depth };
        //         return xPos;
        //     };
    
        //     traverse(0, 0, 0);
        //     return positions;
        // };

        const calculateNodePositions = () => {
            const positions = {};
            const levelWidths = {}; // Przechowuje szerokości poziomów
        
            const traverse = (nodeId, depth) => {
                if (!levelWidths[depth]) levelWidths[depth] = 0;
        
                // Pobierz dzieci węzła
                const children = treeData.tree_structure.edges
                    .filter(edge => edge.source === nodeId)
                    .map(edge => edge.target);
        
                let xPos;
                if (children.length > 0) {
                    // Rekurencyjnie przejdź do dzieci
                    const childPositions = children.map(childId => traverse(childId, depth + 1));
        
                    // Wyśrodkuj rodzica względem dzieci
                    xPos = (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
                } else {
                    // Jeśli to liść, ustaw pozycję na podstawie szerokości poziomu
                    xPos = levelWidths[depth];
                    levelWidths[depth] += 1; // Zwiększ szerokość poziomu
                }
        
                // Zapisz pozycję węzła
                positions[nodeId] = { x: xPos, y: -depth }; // Ustaw pozycję
                return xPos;
            };
        
            // Zacznij od korzenia
            traverse(0, 0);
            return positions;
        };
        
    
        const positions = calculateNodePositions();
    
        const nodes = treeData.tree_structure.nodes.map(node => ({
            x: [positions[node.id].x],
            y: [positions[node.id].y],
            text: node.feature !== null
                ? `<b>${treeData.feature_names[node.feature]}</b>≥ ${node.threshold.toFixed(2)}`
                : `<b>${treeData.unique_classes[node.value.indexOf(Math.max(...node.value))]}</b>`,
            mode: "markers+text",
            textposition: node.feature !== null ? "right" : "bottom",
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
                    xaxis: { showgrid: false, zeroline: false, visible: false },
                    yaxis: { showgrid: false, zeroline: false, visible: false },
                    showlegend: false,
                }}
                bigger={true}
            />
        );
    };

    return (
        <div>
            {renderDataframe()}
            {renderTrueScatterPlot()}
            {renderPredScatterPlot()}
            {renderPerformanceMetrics()}
            {renderConfusionMatrixHeatmap()}
            {renderClassificationReport()}
            {renderFeatureImportance()}
            {renderTree()}
            {renderROCPlot()}
            {renderPRPlot()}
        </div>
    );
}

export default DecisionTree