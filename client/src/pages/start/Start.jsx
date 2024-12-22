import React, { useState } from 'react';
import TabPanel from '../../components/TabPanel';
import FileUploader from '../../components/FileUploader';
import Datasets from '../../components/Datasets';
import { AppBar, Tab, Tabs, Box } from '@mui/material';

const Start = ({ file, setFile, data, setData, setColumnTypes, onProceed, setTarget }) => {
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
            />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
            <Datasets
                setData={setData}
                onProceed={onProceed}
                setColumnTypes={setColumnTypes}
                setTarget={setTarget}
            />
        </TabPanel>
    </Box>
  )
}

export default Start