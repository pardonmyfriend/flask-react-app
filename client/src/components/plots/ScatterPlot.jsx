import React from 'react';
import Plot from 'react-plotly.js';
import ResponsivePlot from './ResponsivePlot';

const ScatterPlot = ({ data, title, xTitle, yTitle }) => {
    return (
        <ResponsivePlot
            data={data}
            layout={{
                autosize: true,
                title: {
                    text: title,
                },
                xaxis: {
                    title: { text: xTitle },
                    automargin: true,
                    showgrid: true,
                    zeroline: false,
                },
                yaxis: {
                    title: { text: yTitle },
                    automargin: true,
                    showgrid: true,
                    zeroline: false,
                },
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    xanchor: 'center',
                    y: -0.2,
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

export default ScatterPlot;
