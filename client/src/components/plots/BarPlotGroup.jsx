import React from 'react';
import ResponsivePlot from './ResponsivePlot';

const BarPlotGroup = ({ xData, yData1, yData2, title, name1, name2, xTitle, yTitle }) => {
    return (
        <ResponsivePlot
            data = {[
                {
                    x: xData,
                    y: yData1,
                    type: 'bar',
                    name: name1,
                    marker: { color: 'rgba(63, 189, 189, 0.6)' },
                },
                {
                    x: xData,
                    y: yData2,
                    type: 'bar',
                    name: name2,
                    marker: { color: 'rgba(76, 125, 157, 0.6)' },
                }
            ]}
            layout = {{
                title: title,
                barmode: 'group',
                xaxis: { title: xTitle },
                yaxis: { title: yTitle },
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    xanchor: 'center',
                    y: -0.3,
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

export default BarPlotGroup;
