import './App.css';
import FileUploader from './components/FileUploader';
import ProgressStepper from './components/ProgressStepper';
import DataTable from './components/DataTable';
import Algorithms from './pages/algorithms/Algorithms';
import Dashboard from './pages/dashboards/Dashboard'

function App() {
  const pages = ['File upload', 'Data', 'Analysis', 'Results']
  const pageContent = [<FileUploader />, <DataTable />, <Algorithms />, <Dashboard />]

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
