// App.tsx
import { useState } from 'react';
import './App.css';

function App() {
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [hints, setHints] = useState<string[] | null>(null);
  const [unitTests, setUnitTests] = useState<string[] | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showUnitTests, setShowUnitTests] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [testResults, setTestResults] = useState<string | null>(null);

  const executePython = async () => {
    try {
      // <--- CHANGED THIS URL TO PORT 5172
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

        if (typeof parsedProblemData === 'string') {
          try {
            parsedProblemData = JSON.parse(parsedProblemData);
          } catch (e) {
            setPythonOutput(`Error parsing string: ${e}`);
            setHints(null);
            setUnitTests(null);
            setShowHints(false);
            setShowUnitTests(false);
            return;
          }
        }

        let mainProblemText = "";
        let problemHints: string[] = [];
        let problemUnitTests: string[] = [];

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

        setPythonOutput(mainProblemText);
        setHints(problemHints);
        setUnitTests(problemUnitTests);
        setShowHints(false);
        setShowUnitTests(false);
        setTestResults(null);

      } else {
        setPythonOutput(data.error);
        setHints(null);
        setUnitTests(null);
        setShowHints(false);
        setShowUnitTests(false);
        setTestResults(null);
      }
    } catch (error) {
      console.error('Error executing Python script:', error);
      setPythonOutput('An error occurred.');
      setHints(null);
      setUnitTests(null);
      setShowHints(false);
      setShowUnitTests(false);
      setTestResults(null);
    }
  };

  const runTests = async () => {
    if (!unitTests || unitTests.length === 0) {
      setTestResults("No unit tests available to run.");
      return;
    }

    try {
      setTestResults("Running tests...");
      // <--- CHANGED THIS URL TO PORT 5172
      const response = await fetch('http://localhost:5172/run-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitTests: unitTests }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResults(data.message);
      } else {
        setTestResults(`Error running tests: ${data.error}`);
      }
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults('An error occurred while trying to run tests.');
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const toggleUnitTests = () => {
    setShowUnitTests(!showUnitTests);
  };

  const displayHints = () => {
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
        {hints !== null && <button onClick={toggleHints}>Show Hints</button>}
        {unitTests !== null && <button onClick={toggleUnitTests}>Show Unit Tests</button>}
        {unitTests !== null && unitTests.length > 0 && <button onClick={runTests}>Test My Code</button>}
        {displayHints()}
        {displayUnitTests()}
        {testResults && <p><strong>Test Results:</strong> {testResults}</p>}
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