import React, { useState, useEffect } from 'react';
import { Box, AppBar, Tabs, Tab } from '@mui/material';
import TabPanel from '../../components/TabPanel';
import DimensionReduction from './DimensionReduction';
import ClusterAnalysis from './ClusterAnalysis';
import Classification from './Classification';
import ParamsDialog from '../../components/ParamsDialog';

function Algorithms({ onProceed, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected }) {
  const [activeTab, setActiveTab] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paramsInfo, setParamsInfo] = useState({});

  useEffect(() => {
    if (algorithmSelected) {
      onProceed(true);
    }
    else {
      onProceed(false);
    }
  }, [algorithmSelected, onProceed]);

  const handleTileClick = (algorithm) => {
    setAlgorithmName('')
    setParamsInfo({});
    setParams({})
    setAlgorithmSelected(false);
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
    console.log(algorithmName)
    console.log(params);
    setAlgorithmSelected(true);
    onProceed(true)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <AppBar position='static'>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label='Dimension reduction' />
          <Tab label='Cluster analysis' />
          <Tab label='Classification' />
        </Tabs>
      </AppBar>
      
      <TabPanel value={activeTab} index={0}>
        <DimensionReduction 
          handleTileClick={handleTileClick} 
          algorithmName={algorithmName}
          setAlgorithmName={setAlgorithmName}
          params={params}
          setParams={setParams}
          algorithmSelected={algorithmSelected}
          setAlgorithmSelected={setAlgorithmSelected}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ClusterAnalysis 
          handleTileClick={handleTileClick} 
          algorithmName={algorithmName}
          setAlgorithmName={setAlgorithmName}
          params={params}
          setParams={setParams}
          algorithmSelected={algorithmSelected}
          setAlgorithmSelected={setAlgorithmSelected}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Classification 
          handleTileClick={handleTileClick} 
          algorithmName={algorithmName}
          setAlgorithmName={setAlgorithmName}
          params={params}
          setParams={setParams}
          algorithmSelected={algorithmSelected}
          setAlgorithmSelected={setAlgorithmSelected}
        />
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