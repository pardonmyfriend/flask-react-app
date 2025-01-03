import React, { useState } from 'react';
import './App.css';
// import FileUploader from './components/FileUploader';
import DataInput from './pages/DataInput';
import ProgressStepper from './components/ProgressStepper';
import DataTable from './components/DataTable';
import Algorithms from './pages/Algorithms';
import Dashboard from './pages/Dashboard'
import Preview from './pages/Preview';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Start from './pages/Start';

function App() {
  const [isStartPage, setIsStartPage] = useState(true);

  const handleStartPageClick = () => {
    setIsStartPage(false);
  };

  const pages = ['File upload', 'Preview', 'Data', 'Analysis', 'Results']
  const pageContent = [<DataInput />, <Preview/>, <DataTable />, <Algorithms />, <Dashboard />]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`App ${isStartPage ? 'no-padding' : ''}`}>
      {isStartPage ? (
          <Start onClick={handleStartPageClick} />
        ) : (
          <ProgressStepper steps={pages} stepContent={pageContent} />
        )}
        {/* <ProgressStepper 
          steps={pages}
          stepContent={pageContent}
        /> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
