import React from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';

const ResponsivePlot = ({ data, layout, bigger, divHeight }) => {
    const { width, height, ref } = useResizeDetector();

    return (
        <div ref={ref} style={{ width: '100%', height: divHeight ? divHeight : (bigger ? '700px' : '500px') }}>
            {width && height && (
                <Plot
                    data={data}
                    layout={{ ...layout, width, height }}
                    config={{
                        responsive: true,
                        displayModeBar: true,
                        displaylogo: false,
                    }}
                />
            )}
        </div>
    );
};

export default ResponsivePlot;