import React from 'react';
import { Box, Typography } from '@mui/material';

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box mt={2} mx={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default TabPanel;
