// App.tsx
import { useState, useEffect } from 'react';
import './App.css';

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
  const [unitTests, setUnitTests] = useState<UnitTest[] | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [testStatuses, setTestStatuses] = useState<Array<'idle'|'running'|'passed'|'failed'>>([]);
  const [problemCount, setProblemCount] = useState<number>(() => Number(window.localStorage.getItem('problemCount')) || 0);
  const [testCount, setTestCount] = useState<number>(() => Number(window.localStorage.getItem('testCount')) || 0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Reset counters on initial load (so each time you open the website they start at 0)
  useEffect(() => {
    try {
      window.localStorage.setItem('problemCount', '0');
      window.localStorage.setItem('testCount', '0');
    } catch {}
    setProblemCount(0);
    setTestCount(0);
    const start = Date.now();
    setSecondsElapsed(0);
    const tid = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(tid);
  }, []);

  const fetchProblem = async () => {
    setProblemCount((prev) => {
      const next = prev + 1;
      try { window.localStorage.setItem('problemCount', String(next)); } catch {};
      return next;
    });
    setLoading(true);
    setError(null);
    setProblemDescription(null);
    setHints(null);
    setUnitTests(null);
    setShowHints(false);
    setTestResults(null);

    try {
      const response = await fetch('/api/cgen/', {
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
    setTestCount((prev) => {
      const next = prev + 1;
      try { window.localStorage.setItem('testCount', String(next)); } catch {};
      return next;
    });
    if (!unitTests || unitTests.length === 0) {
      setTestResults("No unit tests available to run.");
      return;
    }

    setTesting(true);
    setTestResults("Running tests...");
    setError(null);

    try {
      const unitTestsAsJsonStrings = unitTests.map(test => JSON.stringify(test));

      // mark all tests as running
      setTestStatuses(unitTests.map(() => 'running'));

      const response = await fetch('/api/check/run-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitTests: unitTestsAsJsonStrings }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResults(data.message);

        // parse backend lines to determine per-test pass/fail
        const lines: string[] = (data.message || '').split('\n').map((l: string) => l.trim());

        // if a compile failure for any program exists, mark all tests failed for that program;
        // for simplicity, we'll mark a test as failed if any line contains "Test {i} FAILED";
        const statuses = unitTests.map((_, idx) => {
          const testNum = idx + 1;
          const failed = lines.some((l: string) => l.includes(`Test ${testNum} FAILED`));
          const passed = lines.some((l: string) => l.includes(`Test ${testNum} PASSED`));
          if (failed) return 'failed' as const;
          if (passed) return 'passed' as const;
          // fallback: if message contains "FAILED TO COMPILE" mark failed
          if (lines.some((l: string) => l.includes('FAILED TO COMPILE'))) return 'failed' as const;
          return 'idle' as const;
        });

        setTestStatuses(statuses);
      } else {
        setError(`Error running tests: ${data.error || JSON.stringify(data)}`);
        setTestResults(null);
        setTestStatuses(unitTests.map(() => 'failed'));
      }
    } catch (error) {
      console.error('Error running tests:', error);
      setError('An error occurred while trying to run tests. Please ensure the C test runner backend is running.');
      setTestResults(null);
      setTestStatuses(unitTests.map(() => 'failed'));
    } finally {
      setTesting(false);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
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

  const renderUnitTestsPanel = () => {
    if (unitTests !== null && unitTests.length > 0) {
      return (
        <aside className="unit-tests-panel" aria-label="Unit tests">
          <h3>Requirements</h3>
          <ul className="unit-test-list">
            {unitTests.map((test, index) => {
              const status = testStatuses && testStatuses[index];
              const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : status === 'running' ? '⏳' : '▫️';
              return (
                <li key={index} className="unit-test-item">
                  <div className="test-status"><span className="status-icon" aria-hidden>{icon}</span>
                    <strong>Args:</strong> <code>{JSON.stringify(test.args)}</code>
                  </div>
                  <div><strong>Expected:</strong> <code>{test.output}</code></div>
                  <div><strong>Exit:</strong> <code>{test.exit_code}</code></div>
                </li>
              );
            })}
          </ul>
          <p className="muted">These tests will be sent to the backend service for compilation and execution.</p>
          <div style={{ marginTop: '0.75rem' }}>
            <button onClick={runTests} disabled={testing}>
              {testing ? 'Running Tests...' : 'Test My Code'}
            </button>
          </div>
        </aside>
      );
    }
    return (
      <aside className="unit-tests-panel">
        <h3>Requirements</h3>
        <p>No requirements available.</p>
      </aside>
    );
  };

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="counter-box">
        <div><strong>Problems:</strong> {problemCount}</div>
        <div><strong>Tests:</strong> {testCount}</div>
        <div><strong>Time:</strong> {formatDuration(secondsElapsed)}</div>
      </div>

      {renderUnitTestsPanel()}

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
          <p>Note: Your code must be written in a file called "main.c".</p>
        </div>
        <div>
          {hints !== null && hints.length > 0 && (
            <button
              onClick={toggleHints}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
          )}
        </div> 

        {displayHints()}
      </div>

      <div>
        {}
        <iframe
          src='/terminal/'
          title='the ghost'
          className='terminal w-full h-80 border-none'
        >
        </iframe>
      </div>
    </div>
  );
}

export default App;
