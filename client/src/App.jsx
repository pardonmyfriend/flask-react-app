import './App.css';
// import FileUploader from './components/FileUploader';
import Start from './pages/Start';
import ProgressStepper from './components/ProgressStepper';
import DataTable from './components/DataTable';
import Algorithms from './pages/Algorithms';
import Dashboard from './pages/Dashboard'
import Preview from './pages/Preview';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

function App() {
  const pages = ['File upload', 'Preview', 'Data', 'Analysis', 'Results']
  const pageContent = [<Start />, <Preview/>, <DataTable />, <Algorithms />, <Dashboard />]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ProgressStepper 
          steps={pages}
          stepContent={pageContent}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
