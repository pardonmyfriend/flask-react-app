import './App.css';
// import { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
import FileUploader from './components/FileUploader';
import ProgressStepper from './components/ProgressStepper';
import DataTable from './components/DataTable';
import TabPanel from './pages/algorithms/Algorithms';
import Dashboard from './pages/Dashboard'
import Preview from './components/Preview';

function App() {
  const pages = ['File upload', 'Preview', 'Data', 'Analysis', 'Results']
  const pageContent = [<FileUploader />, <Preview/>, <DataTable />, <TabPanel />, <Dashboard />]

  return (
    <div className="App">
      <ProgressStepper 
        steps={pages}
        stepContent={pageContent}
      />
    </div>
  );
}

export default App;
