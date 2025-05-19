import { useState } from 'react';
import './App.css';

function App() {
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [hints, setHints] = useState<string[] | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false); // New state for toggling visibility
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
        // Parse the JSON response
        const problemData = data.result;

        if (Array.isArray(problemData)) {
          if (problemData.length > 0) {
            const firstProblem = problemData[0];
            let mainProblemText = "";
            let problemHints: string[] = [];

            if (firstProblem && typeof firstProblem === 'object') {
              if (firstProblem.hasOwnProperty('main_p')) {
                mainProblemText = firstProblem.main_p;
              }
              if (firstProblem.hasOwnProperty('hints')) {
                problemHints = firstProblem.hints;
              }
              setPythonOutput(mainProblemText);
              setHints(problemHints);
              setShowHints(false); // Initialize showHints to false when new problem is loaded
            } else {
              setPythonOutput("Problem Structure Error: main_p not found");
              setHints(null);
              setShowHints(false);
            }
          } else {
            setPythonOutput("No problems found in the array.");
            setHints(null);
            setShowHints(false);
          }
        } else if (typeof problemData === 'string') {
          try {
            const parsedProblemData = JSON.parse(problemData);
            if (Array.isArray(parsedProblemData)) {
              if (parsedProblemData.length > 0) {
                const firstProblem = parsedProblemData[0];
                let mainProblemText = "";
                let problemHints: string[] = [];
                if (firstProblem && typeof firstProblem === 'object') {
                  if (firstProblem.hasOwnProperty('main_p')) {
                    mainProblemText = firstProblem.main_p;
                  }
                  if (firstProblem.hasOwnProperty('hints')) {
                    problemHints = firstProblem.hints;
                  }
                  setPythonOutput(mainProblemText);
                  setHints(problemHints);
                  setShowHints(false);
                } else {
                  setPythonOutput("Problem Structure Error: main_p not found");
                  setHints(null);
                  setShowHints(false);
                }
              } else {
                setPythonOutput("No problems found in the array.");
                setHints(null);
                setShowHints(false);
              }
            } else if (typeof parsedProblemData === 'object' && parsedProblemData !== null && parsedProblemData.hasOwnProperty('main_p')) {
              setPythonOutput(parsedProblemData.main_p);
              setHints(parsedProblemData.hints || null);
              setShowHints(false);
            } else {
              setPythonOutput("Invalid problem data format.");
              setHints(null);
              setShowHints(false);
            }

          } catch (e) {
            setPythonOutput(`Error parsing string: ${e}`);
            setHints(null);
            setShowHints(false);
          }
        } else if (typeof problemData === 'object' && problemData !== null && parsedProblemData.hasOwnProperty('main_p')) {
          setPythonOutput(problemData.main_p);
          setHints(problemData.hints || null);
          setShowHints(false);
        } else {
          setPythonOutput("Invalid problem data format.");
          setHints(null);
          setShowHints(false);
        }

      } else {
        setPythonOutput(data.error);
        setHints(null);
        setShowHints(false);
      }
    } catch (error) {
      console.error('Error executing Python script:', error);
      setPythonOutput('An error occurred.');
      setHints(null);
      setShowHints(false);
    }
  };

  const toggleHints = () => { // Renamed to toggleHints
    setShowHints(!showHints); // Toggle the value of showHints
  };

  const displayHints = () => {
    if (showHints && hints && hints.length > 0) { // Use showHints to control display
      return (
        <div>
          <h3>Hints:</h3>
          <ul>
            {hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      );
    } else if (showHints && hints !== null) {
      return <p>No hints available.</p>;
    }
    return null;
  };

  return (
    <>
      <div>
        <h1>Ghost In The C</h1>
        <button onClick={executePython}>Give me a problem</button>
        {pythonOutput && <p>Problem: {pythonOutput}</p>}
        {hints && <button onClick={toggleHints}>Show Hints</button>} { /* Changed to toggleHints */ }
        {displayHints()}
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