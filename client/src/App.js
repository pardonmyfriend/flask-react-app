import './App.css';
// import { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
import FileUploader from './components/FileUploader';
import ProgressStepper from './components/ProgressStepper';
import DataTable from './components/DataTable';
import Dashboard from './components/Dashboard';

function App() {

  // const [articles, setArticles] = useState([])

  const steps = ['Step 1', 'Step 2', 'Step 3']
  const stepContent = [<FileUploader />, <DataTable />, <Dashboard />]

  // const handleFileUpload = (file) => {
  //   console.log('Loaded file: ', file);
  // }

  // useEffect(() => {
  //   fetch('http://localhost:5000/data/articles', {
  //     'methods': 'GET',
  //     'headers': {
  //       'Content-Type': 'applications/json'
  //     }
  //   })
  //   .then(resp => resp.json())
  //   .then(resp => setArticles(resp))
  //   .catch(error => console.log(error))
  // }, [])

  return (
    <div className="App">
      {/* <h1>Flask and React</h1>

      {articles.map((item, index) => {
        return (
          <div key={index}>
            <h2>{item.title}</h2>
            <p>{item.subtitle}</p>
          </div>
        )
      })} */
      }
      <ProgressStepper 
        steps={steps}
        stepContent={stepContent}
      />
    </div>
  );
}

export default App;
