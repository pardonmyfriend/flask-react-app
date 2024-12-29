import React from 'react'
import ResponsivePlot from './ResponsivePlot';

const Heatmap = ({ xData, yData, zData, title, xTitle, yTitle }) => {
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
                    hoverinfo: 'none',
                    text: zData.map(row => row.map(value => value.toFixed(2))),
                    texttemplate: '%{text}',
                },
            ]}
            layout={{
                autosize: true,
                title: title,
                xaxis: {
                    title: xTitle,
                    automargin: true,
                },
                yaxis: {
                    title: yTitle,
                    automargin: true,
                    autorange: 'reversed',
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