import React, { useState, useEffect } from 'react';
import { Box, AppBar, Tabs, Tab } from '@mui/material';
import TabPanel from '../components/TabPanel';
import DimensionReduction from './algorithms/DimensionReduction'
import ClusterAnalysis from './algorithms/ClusterAnalysis';
import Classification from './algorithms/Classification';
import ParamsDialog from '../components/ParamsDialog';

function Algorithms({ onProceed, algorithmName, setAlgorithmName, params, setParams, data, algorithmSelected, setAlgorithmSelected, algTab, setAlgTab, target }) {
  const [activeTab, setActiveTab] = useState(algTab)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paramsInfo, setParamsInfo] = useState({});
  const [defaultParams, setDefaultParams] = useState({})

  useEffect(() => {
    if (algorithmSelected) {
      onProceed(true);
    }
    else {
      onProceed(false);
    }
  }, [algorithmSelected, onProceed]);

  const handleTileClick = (algorithm) => {
    const payload = params ? {
      algorithm: algorithm,
      params: params,
      data: data.rows,
      target: target
    } : {
      algorithm: algorithm,
      data: data.rows,
      target: target
    }

    setDefaultParams({})
    setAlgorithmName('')
    setParamsInfo({});
    setParams({})
    setAlgTab(activeTab)
    // setAlgorithmSelected(false);
    fetch(`http://localhost:5000/algorithms/get_algorithm_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      if (data.algorithm) {
        setAlgorithmName(data.algorithm.algorithm_name)
        setParamsInfo(data.algorithm.param_info)
        setDefaultParams(data.algorithm.params)
        console.log(data.algorithm)
        setDialogOpen(true);
      }
    })
    .catch(error => {
      console.error(`Error for ${algorithm}:`, error);
    });
  };

  const handleSaveParams = (params) => {
    console.log(defaultParams)
    console.log(params)
    setAlgorithmSelected(true);
    onProceed(true)
  };

  const handleDialogClose = () => {
    setDefaultParams({});
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
          target={target}
        />
      </TabPanel>

      <ParamsDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSaveParams={handleSaveParams}
        algorithmName={algorithmName}
        paramsInfo={paramsInfo}
        defaultParams={defaultParams}
        params={params}
        setParams={setParams}
      />
    </Box>
  )
}

export default Algorithms