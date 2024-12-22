import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsivePlot from "../../components/plots/ResponsivePlot";
import DataTable from "../../components/plots/DataTable";
import ScatterPlot from "../../components/plots/ScatterPlot";

function TSNE({ tsneData, target }) {
    const renderTSNEDataframe = () => {
        const keys = Object.keys(tsneData.tsne_dataframe[0]);

        console.log(keys)

        const orderedKeys = keys.includes('id') 
        ? ['id', ...keys.filter((key) => key !== 'id')] 
        : keys;
        
        const cols = orderedKeys.map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            ...(orderedKeys.length <= 6 ? { flex: 1 } : { width: 150 }),
        }));

        const rows = tsneData.tsne_dataframe;

        return (
            <DataTable
                rows={rows}
                cols={cols}
            />
        );
    };

    const renderScatterPlot = () => {
        const uniqueGroups = [...new Set(tsneData.tsne_dataframe.map(row => row[target]))];
        const colorMap = uniqueGroups.reduce((map, group, index) => {
            const colors = ['#D94F3D', '#4F9D50', '#4C7D9D', '#D1A23D', '#7D3F9A', '#1C7C6C', '#C84C4C', '#4F8C4F', '#3A7BBF', '#8C5E8C'];
            map[group] = colors[index % colors.length];
            return map;
        }, {});
    
        const data = uniqueGroups.map(group => ({
            x: tsneData.tsne_dataframe
                .filter(row => row[target] === group)
                .map(row => row.F1),
            y: tsneData.tsne_dataframe
                .filter(row => row[target] === group)
                .map(row => row.F2),
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
                title={'Scatter plot: F1 vs F2'}
                xTitle={'F1'}
                yTitle={'F2'}
            />
        );
    };

    const renderBarPlot = () => {
        const data = [
            {
                x: ['Trustworthiness Score'],
                y: [tsneData.trust_score],
                type: 'bar',
                name: 'Trustworthiness',
                marker: {
                    color: '#3FBDBD',
                },
            },
        ];
    
        return (
            <ResponsivePlot
                data={data}
                layout={{
                    autosize: true,
                    title: {
                        text: 'Trustworthiness Score',
                    },
                    xaxis: {
                        title: {
                            text: 'Metric',
                        },
                        automargin: true,
                        showgrid: false,
                    },
                    yaxis: {
                        title: {
                            text: 'Wartość',
                        },
                        automargin: true,
                        showgrid: true,
                        zeroline: true,
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

    const renderHistogramPlots = () => {
        const originalDistancesFlat = tsneData.original_distances;
        const tsneDistancesFlat = tsneData.tsne_distances;
      
        return (
          <div>
            <ResponsivePlot
              data={[
                {
                  x: originalDistancesFlat,
                  type: "histogram",
                  nbinsx: 50,
                  marker: { color: '#329797' },
                },
              ]}
              layout={{
                title: "Histogram odległości w przestrzeni oryginalnej",
                xaxis: { title: "Odległość" },
                yaxis: { title: "Liczba par" },
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false, 
            }}
            />
      
            <ResponsivePlot
              data={[
                {
                  x: tsneDistancesFlat,
                  type: "histogram",
                  nbinsx: 50,
                  marker: { color: '#329797' },
                },
              ]}
              layout={{
                title: "Histogram odległości w przestrzeni t-SNE",
                xaxis: { title: "Distance" },
                yaxis: { title: "Pair count" },
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false, 
            }}
            />
          </div>
        );
    };

    return (
        <div>
            {renderTSNEDataframe()}
            {renderScatterPlot()}
            {renderHistogramPlots()}
            {renderBarPlot()}
        </div>
    )
}

export default TSNE