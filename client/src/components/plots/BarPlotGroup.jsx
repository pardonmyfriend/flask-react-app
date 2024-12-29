import React from 'react';
import ResponsivePlot from './ResponsivePlot';

const BarPlotGroup = ({ xData, yData1, yData2 }) => {
    return (
        <ResponsivePlot
            data = {[
                {
                    x: xData,
                    y: yData1,
                    type: 'bar',
                    name: 'Train Set',
                    marker: { color: 'rgba(63, 189, 189, 0.6)' },
                },
                {
                    x: xData,
                    y: yData2,
                    type: 'bar',
                    name: 'Test Set',
                    marker: { color: 'rgba(76, 125, 157, 0.6)' },
                }
            ]}
            layout = {{
                title: 'Class Distribution in Train and Test Sets',
                barmode: 'group',
                xaxis: { title: 'Classes' },
                yaxis: { title: 'Counts' },
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    xanchor: 'center',
                    y: -0.2,
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
