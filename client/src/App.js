import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/data/articles', {
      'methods': 'GET',
      'headers': {
        'Content-Type': 'applications/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setArticles(resp))
    .catch(error => console.log(error))
  }, [])

  return (
    <div className="App">
      <h1>Flask and React</h1>

      {articles.map((item, index) => {
        return (
          <div key={index}>
            <h2>{item.title}</h2>
            <p>{item.subtitle}</p>
          </div>
        )
      })}
    </div>
  );
}

export default App;
