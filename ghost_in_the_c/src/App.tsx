import { useState } from 'react';
import './App.css';

function App() {
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");

  const executePython = async () => {
    try {
      const response = await fetch('http://localhost:5000/execute-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();

      if (response.ok) {
        setPythonOutput(data.result);
      } else {
        setPythonOutput(data.error);
      }
    } catch (error) {
      console.error('Error executing Python script:', error);
      setPythonOutput('An error occurred.');
    }
  };

  return (
    <>
      <div>
        <h1>Ghost In The C</h1>
        <button onClick={executePython}>Give me a problem</button>
        {pythonOutput && <p>Python Output: {pythonOutput}</p>}
      </div>
      <div className='terminal-div'>
        <iframe
          src='http://localhost:4200/'
          title='the ghost'
          className='terminal'
          >
        </iframe>
      </div>
    </>
  );
}

export default App;
