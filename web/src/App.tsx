// App.tsx
import { useState } from 'react';
import './App.css'; // Removed this line as Tailwind CSS is used for styling

// Define the interfaces for the data received from the backend
interface UnitTest {
  args: string[];
  output: string;
  exit_code: number;
}

interface Problem {
  description: string;
  hints: string[];
  unit_tests: UnitTest[];
}

function App() {
  const [problemDescription, setProblemDescription] = useState<string | null>(null);
  const [hints, setHints] = useState<string[] | null>(null);
  const [unitTests, setUnitTests] = useState<UnitTest[] | null>(null); // Use UnitTest interface
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showUnitTests, setShowUnitTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [testing, setTesting] = useState<boolean>(false); // State for testing indicator

  const fetchProblem = async () => {
    setLoading(true); // Set loading to true when fetching starts
    setError(null); // Clear previous errors
    setProblemDescription(null);
    setHints(null);
    setUnitTests(null);
    setShowHints(false);
    setShowUnitTests(false);
    setTestResults(null);

    try {
      const response = await fetch('http://localhost:5000/', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: Problem = await response.json(); 

      if (response.ok) {
        setProblemDescription(data.description);
        setHints(data.hints);
        setUnitTests(data.unit_tests);
      } else {
        setError(`Failed to fetch problem: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error('Error fetching problem:', err);
      setError('An error occurred while trying to fetch a problem. Please ensure the backend server is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    if (!unitTests || unitTests.length === 0) {
      setTestResults("No unit tests available to run.");
      return;
    }

    setTesting(true); 
    setTestResults("Running tests..."); 
    setError(null); 

    try {
      const unitTestsAsJsonStrings = unitTests.map(test => JSON.stringify(test));

      const response = await fetch('http://localhost:5172/run-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitTests: unitTestsAsJsonStrings }), 
      });

      const data = await response.json();

      if (response.ok) {
        setTestResults(data.message);
      } else {
        setError(`Error running tests: ${data.error || JSON.stringify(data)}`);
        setTestResults(null); 
      }
    } catch (error) {
      console.error('Error running tests:', error);
      setError('An error occurred while trying to run tests. Please ensure the C test runner backend is running on port 5172.');
      setTestResults(null); 
    } finally {
      setTesting(false); 
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
                <li key={index}>
                  Args: <code>{JSON.stringify(test.args)}</code>, Expected Output: <code>"{test.output}"</code>, Expected Exit Code: <code>{test.exit_code}</code>
                </li>
              ))}
            </ul>
            <p>
              These tests will be sent to the backend service for compilation and execution.
            </p>
          </div>
        );
      } else {
        return <p>No unit tests available.</p>;
      }
    }
    return null;
  };

  return (
    <div>
      <div>
        <h1>Ghost In The C</h1>

        <button
          onClick={fetchProblem}
          disabled={loading}
        >
          {loading ? 'Fetching Problem...' : 'Give me a problem'}
        </button>

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        {problemDescription && (
          <div>
            <h2>Problem:</h2>
            <p>{problemDescription}</p>
          </div>
        )}

        <div>
          {hints !== null && hints.length > 0 && (
            <button
              onClick={toggleHints}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
          )}
          {unitTests !== null && unitTests.length > 0 && (
            <button
              onClick={toggleUnitTests}
            >
              {showUnitTests ? 'Hide Unit Tests' : 'Show Unit Tests'}
            </button>
          )}
          {/* Re-enabled and updated 'Test My Code' button */}
          {unitTests !== null && unitTests.length > 0 && (
            <button
              onClick={runTests}
              disabled={testing} // Disable button while testing
            >
              {testing ? 'Running Tests...' : 'Test My Code'}
            </button>
          )}
        </div>

        {displayHints()}
        {displayUnitTests()}

        {testResults && (
          <p>
            <strong>Test Results:</strong> {testResults}
          </p>
        )}
      </div>

      <div>
        <iframe
          src='http://localhost:4200/'
          title='the ghost'
          className='terminal w-full h-80 border-none'
        >
        </iframe>
      </div>
    </div>
  );
}

export default App;
