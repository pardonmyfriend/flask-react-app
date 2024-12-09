import React, { useState } from 'react';
import { Box, AppBar, Tabs, Tab } from '@mui/material';
import TabPanel from '../../components/TabPanel';
import DimensionReduction from './DimensionReduction';
import ClusterAnalysis from './ClusterAnalysis';
import Classification from './Classification';
import ParamsDialog from '../../components/ParamsDialog';

function Algorithms({ onProceed, algorithmName, setAlgorithmName, params, setParams }) {
  const [activeTab, setActiveTab] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paramsInfo, setParamsInfo] = useState({});

  const handleTileClick = (algorithm) => {
    setAlgorithmName('')
    setParamsInfo({});
    setParams({})
    fetch(`http://localhost:5000/algorithms/get_algorithm_info/${algorithm}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if (data.algorithm) {
        setAlgorithmName(data.algorithm.algorithm_name)
        setParamsInfo(data.algorithm.param_info)
        setDialogOpen(true);
      }
    })
    .catch(error => {
      console.error(`Błąd podczas wywoływania ${algorithm}:`, error);
    });
  };

  const handleSaveParams = (params) => {
    //TODO: tu jeszcze zrobić jakieś zaznaczenie wybranego kafelka i wyświetlenie zapisanych parametrów
    console.log(algorithmName)
    console.log('Zapisano parametry:', params);
    onProceed(true)
  };

  const handleDialogClose = () => {
    // setParams({})
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
        paramsInfo={paramsInfo}
        params={params}
        setParams={setParams}
      />
    </Box>
  )
}

export default Algorithms