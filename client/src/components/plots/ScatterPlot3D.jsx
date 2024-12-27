import React from 'react';
import ResponsivePlot from './ResponsivePlot';

const ScatterPlot3D = ({ data, xTitle, yTitle, zTitle }) => {
    return (
        <ResponsivePlot
            data={data}
            layout={{
                autosize: true,
                scene: {
                    xaxis: { title: xTitle },
                    yaxis: { title: yTitle },
                    zaxis: { title: zTitle },
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

export default ScatterPlot3D;
