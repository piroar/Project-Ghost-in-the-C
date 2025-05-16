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
        body: JSON.stringify({ input: input }), // Include input if needed in the future
      });

      const data = await response.json();

      if (response.ok) {
        // Parse the JSON response
        const problemData = data.result;
        if (typeof problemData === 'string') {
          try {
              const parsedProblemData = JSON.parse(problemData);
               if (Array.isArray(parsedProblemData)) {
                  if (parsedProblemData.length > 0) {
                    const firstProblem = parsedProblemData[0];
                    if (firstProblem && typeof firstProblem === 'object' && firstProblem.hasOwnProperty('main_p')) {
                      setPythonOutput(firstProblem.main_p);
                    } else {
                      setPythonOutput("Problem Structure Error: main_p not found");
                    }
                  } else {
                    setPythonOutput("No problems found in the array.");
                  }
               }
              else if (typeof parsedProblemData === 'object' && parsedProblemData !== null && parsedProblemData.hasOwnProperty('main_p'))
              {
                setPythonOutput(parsedProblemData.main_p)
              }
              else
              {
                setPythonOutput("Invalid problem data format.");
              }

            } catch(e) {
              setPythonOutput(`Error parsing string: ${e}`);
            }
        }
        else {
          setPythonOutput("Invalid problem data format.");
        }

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
        {pythonOutput && <p>Problem: {pythonOutput}</p>}
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