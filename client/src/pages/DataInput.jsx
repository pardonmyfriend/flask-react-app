import React, { useState } from 'react';
import TabPanel from '../components/TabPanel';
import FileUploader from '../components/FileUploader';
import Datasets from '../components/Datasets';
import { AppBar, Tab, Tabs, Box } from '@mui/material';

const DataInput = ({ file, setFile, selectedDataset, setSelectedDataset, data, setData, setColumnTypes, onProceed, setTarget, setAlgTab, setAlgorithmName, setParams, setAlgorithmSelected, columnTypesAligned, setColumnTypesAligned }) => {
    const [activeTab, setActiveTab] = useState(0)

  return (
    <Box>
        <AppBar position='static'>
            <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant='fullWidth'
            >
                <Tab label='Upload your data' />
                <Tab label='Choose dataset' />
            </Tabs>
        </AppBar>

        <TabPanel value={activeTab} index={0}>
            <FileUploader
                file={file}
                setFile={setFile}
                data={data}
                setData={setData}
                setColumnTypes={setColumnTypes}
                onProceed={onProceed}
                setAlgTab={setAlgTab}
                setAlgorithmName={setAlgorithmName}
                setParams={setParams}
                setAlgorithmSelected={setAlgorithmSelected}
                columnTypesAligned={columnTypesAligned}
                setColumnTypesAligned={setColumnTypesAligned}
            />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
            <Datasets
                data={data}
                setData={setData}
                selectedDataset={selectedDataset}
                setSelectedDataset={setSelectedDataset}
                onProceed={onProceed}
                setColumnTypes={setColumnTypes}
                setTarget={setTarget}
                setAlgTab={setAlgTab}
                setAlgorithmName={setAlgorithmName}
                setParams={setParams}
                setAlgorithmSelected={setAlgorithmSelected}
                columnTypesAligned={columnTypesAligned}
                setColumnTypesAligned={setColumnTypesAligned}
            />
        </TabPanel>
    </Box>
  )
}

export default DataInput;