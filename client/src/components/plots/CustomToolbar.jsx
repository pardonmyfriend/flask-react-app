import React from 'react';
import {
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <div style={{
        backgroundColor: '#474747',
        fontWeight: 'bold',
        padding: '10px',
        fontSize: '30px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </div>
  );
}

export default CustomToolbar;
