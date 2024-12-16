import React from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';

const ResponsivePlot = ({ data, layout, config }) => {
    const { width, height, ref } = useResizeDetector();

    return (
        <div ref={ref} style={{ width: '100%', height: '500px' }}>
            {width && height && (
                <Plot
                    data={data}
                    layout={{ ...layout, width, height }}
                    config={config}
                />
            )}
        </div>
    );
};

export default ResponsivePlot;