import React from 'react'
import ResponsivePlot from './ResponsivePlot';

const Heatmap = ({ xData, yData, zData, xTitle, yTitle }) => {
    return (
        <ResponsivePlot
            data={[
                {
                    z: zData,
                    x: xData,
                    y: yData,
                    type: 'heatmap',
                    colorscale: 'RdBu',
                    hoverongaps: false,
                    showscale: true,
                    text: zData.map(row => row.map(value => value.toFixed(2))),
                    texttemplate: '%{text}',
                },
            ]}
            layout={{
                autosize: true,
                xaxis: {
                    title: xTitle,
                    automargin: true,
                },
                yaxis: {
                    title: yTitle,
                    automargin: true,
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
}

export default Heatmap