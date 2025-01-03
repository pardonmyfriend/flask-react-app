import React from 'react';
import ResponsivePlot from './ResponsivePlot';

const ScatterPlot = ({ data, title, xTitle, yTitle }) => {
    return (
        <ResponsivePlot
            data={data}
            layout={{
                autosize: true,
                title: title,
                xaxis: {
                    title: xTitle ,
                    automargin: true,
                    showgrid: true,
                    zeroline: false,
                },
                yaxis: {
                    title: yTitle,
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
