import './App.css';
import FileUploader from './components/FileUploader';
import ProgressStepper from './components/ProgressStepper';
import DataTable from './components/DataTable';
import TabPanel from './pages/algorithms/Algorithms';
import Algorithms from './pages/algorithms/Algorithms';
import Dashboard from './pages/dashboards/Dashboard'
import Preview from './components/Preview';

function App() {
  const pages = ['File upload', 'Preview', 'Data', 'Analysis', 'Results']
  const pageContent = [<FileUploader />, <Preview/>, <DataTable />, <Algorithms />, <Dashboard />]

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
