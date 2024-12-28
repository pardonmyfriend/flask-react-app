import React from 'react';
import ResponsivePlot from './ResponsivePlot';

const ScatterPlot = ({ xData, yData, title, xTitle, yTitle, linear }) => {
    return (
        <ResponsivePlot
            data={[
                {
                    x: xData,
                    y: yData,
                    type: "bar",
                    marker: {color: "rgba(63, 189, 189, 0.6)"},
                },
            ]}
            layout={{
                autosize: true,
                title: title,
                xaxis: {
                    title: xTitle,
                    automargin: true,
                    showgrid: false,
                    tickmode: linear ? "linear" : "auto",
                },
                yaxis: {
                    title: yTitle,
                    automargin: true,
                    showgrid: true,
                },
                hovermode: "closest",
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
