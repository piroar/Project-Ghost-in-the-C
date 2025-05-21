import { useState } from 'react';
import './App.css';

function App() {
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [hints, setHints] = useState<string[] | null>(null);
  const [unitTests, setUnitTests] = useState<string[] | null>(null); // New state for unit tests
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showUnitTests, setShowUnitTests] = useState<boolean>(false); // Fixed typo here
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
        let parsedProblemData: any = data.result;

        // Attempt to parse if it's a string
        if (typeof parsedProblemData === 'string') {
          try {
            parsedProblemData = JSON.parse(parsedProblemData);
          } catch (e) {
            setPythonOutput(`Error parsing string: ${e}`);
            setHints(null);
            setUnitTests(null);
            setShowHints(false);
            setShowUnitTests(false);
            return; // Exit if parsing fails
          }
        }

        let mainProblemText = "";
        let problemHints: string[] = [];
        let problemUnitTests: string[] = [];

        // Determine the actual problem object
        let actualProblemObject: any = null;
        if (Array.isArray(parsedProblemData) && parsedProblemData.length > 0) {
          actualProblemObject = parsedProblemData[0];
        } else if (typeof parsedProblemData === 'object' && parsedProblemData !== null) {
          actualProblemObject = parsedProblemData;
        }

        if (actualProblemObject && typeof actualProblemObject === 'object') {
          if (actualProblemObject.hasOwnProperty('main_p')) {
            mainProblemText = actualProblemObject.main_p;
          }
          if (actualProblemObject.hasOwnProperty('hints') && Array.isArray(actualProblemObject.hints)) {
            problemHints = actualProblemObject.hints;
          }
          if (actualProblemObject.hasOwnProperty('unit_tests') && Array.isArray(actualProblemObject.unit_tests)) {
            problemUnitTests = actualProblemObject.unit_tests;
          }
        } else {
          setPythonOutput("Invalid problem data format.");
          setHints(null);
          setUnitTests(null);
          setShowHints(false);
          setShowUnitTests(false);
          return;
        }

        // Set all states after successful extraction
        setPythonOutput(mainProblemText);
        setHints(problemHints); // Will be [] if no hints or not an array
        setUnitTests(problemUnitTests); // Will be [] if no unit tests or not an array
        setShowHints(false);
        setShowUnitTests(false);

      } else {
        setPythonOutput(data.error);
        setHints(null);
        setUnitTests(null);
        setShowHints(false);
        setShowUnitTests(false);
      }
    } catch (error) {
      console.error('Error executing Python script:', error);
      setPythonOutput('An error occurred.');
      setHints(null);
      setUnitTests(null);
      setShowHints(false);
      setShowUnitTests(false);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const toggleUnitTests = () => {
    setShowUnitTests(!showUnitTests);
  };

  const displayHints = () => {
    // If hints is an empty array, it will correctly show "No hints available."
    if (showHints && hints !== null) {
      if (hints.length > 0) {
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
      } else {
        return <p>No hints available.</p>;
      }
    }
    return null;
  };

  const displayUnitTests = () => {
    // If unitTests is an empty array, it will correctly show "No unit tests available."
    if (showUnitTests && unitTests !== null) {
      if (unitTests.length > 0) {
        return (
          <div>
            <h3>Unit Tests:</h3>
            <ul>
              {unitTests.map((test, index) => (
                <li key={index}>{test}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        return <p>No unit tests available.</p>;
      }
    }
    return null;
  };

  return (
    <>
      <div>
        <h1>Ghost In The C</h1>
        <button onClick={executePython}>Give me a problem</button>
        {pythonOutput && <p>Problem: {pythonOutput}</p>}
        {/* Buttons now appear if hints/unitTests are not null (meaning they were attempted to be extracted) */}
        {hints !== null && <button onClick={toggleHints}>Show Hints</button>}
        {unitTests !== null && <button onClick={toggleUnitTests}>Show Unit Tests</button>}
        {displayHints()}
        {displayUnitTests()}
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