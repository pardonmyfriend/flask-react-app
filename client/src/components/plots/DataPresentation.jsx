import React from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useResizeDetector } from 'react-resize-detector';
import CustomToolbar from './CustomToolbar';

function DataPresentation({ rows, cols }) {
    const { width, height, ref } = useResizeDetector();

    const pageSizeOptions = rows.length > 25 ? [10, 25, 50] : (rows.length > 10 ? [10, 25] : [rows.length]);

    const initialState = rows.length > 10 ? {
        pagination: { paginationModel: { pageSize: 10 } },
    } : {
        pagination: { paginationModel: { pageSize: rows.length } },
    };
    
    const parentDivStyle = rows.length > 10 
        ? { width: width, height: '683px' }
        : { width: width };

  return (
    <div ref={ref} style={{ width: '100%' }}>
        <div style={parentDivStyle}>
            <DataGrid
                rows={rows}
                columns={cols}
                loading={!rows.length}
                showCellVerticalBorder
                showColumnVerticalBorder
                checkboxSelection={false}
                disableRowSelectionOnClick={true}
                initialState={initialState}
                pageSizeOptions={pageSizeOptions}
                slots={{
                    toolbar: CustomToolbar,
                }}
            />
        </div>
    </div>
  )
}

export default DataPresentation