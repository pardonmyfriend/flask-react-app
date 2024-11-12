import React, { useState } from 'react';
import { Box, AppBar, Tabs, Tab } from '@mui/material';
import TabPanel from '../../components/TabPanel';
import DimensionReduction from './DimensionReduction';
import ClusterAnalysis from './ClusterAnalysis';
import Classification from './Classification';
import ParamsDialog from '../../components/ParamsDialog';

function Algorithms() {
  const [activeTab, setActiveTab] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [algorithmName, setAlgorithmName] = useState('');
  const [paramInfo, setParamInfo] = useState({});

  const handleTileClick = (algorithm) => {
    setAlgorithmName('')
    setParamInfo({});
    fetch('http://localhost:5000/algorithms/set_algorithm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ algorithm }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.algorithm) {
        setDialogOpen(true);
        setAlgorithmName(data.algorithm.algorithm_name)
        setParamInfo(data.algorithm.param_info)
      }
    })
    .catch(error => {
      console.error(`Błąd podczas wywoływania ${algorithm}:`, error);
    });
  };

  const handleSaveParams = (params) => {
    console.log(algorithmName)
    console.log('Zapisano parametry:', params);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <AppBar position='static' sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          indicatorColor="inherit"
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab label='Dimension reduction' />
          <Tab label='Cluster analysis' />
          <Tab label='Classification' />
        </Tabs>
      </AppBar>
      
      <TabPanel value={activeTab} index={0}>
        <DimensionReduction handleTileClick={handleTileClick} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ClusterAnalysis handleTileClick={handleTileClick} />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Classification handleTileClick={handleTileClick} />
      </TabPanel>

      <ParamsDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSaveParams={handleSaveParams}
        algorithmName={algorithmName}
        paramInfo={paramInfo}
      />
    </Box>
  )
}

export default Algorithms