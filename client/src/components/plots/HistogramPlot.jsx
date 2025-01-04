import React from 'react'
import ResponsivePlot from './ResponsivePlot'

const HistogramPlot = ({ xData, title, xTitle, yTitle}) => {
  return (
    <ResponsivePlot
      data={[
        {
          x: xData,
          type: "histogram",
          nbinsx: 50,
          marker: { color: 'rgba(63, 189, 189, 0.6)' },
        },
      ]}
      layout={{
        title: title,
        xaxis: { title: xTitle },
        yaxis: { title: yTitle },
        bargap: 0.05,
      }}
      config={{
        responsive: true,
        displayModeBar: true,
        displaylogo: false, 
        }}
    />
  )
}

export default HistogramPlot