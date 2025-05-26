// server.js (combining express_backend.js and testRunner.js)
const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs'); // Need fs for file operations from testRunner part

const app = express();
const PORT = 5172; // The port your Express server will run on

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Configuration for C Test Runner (from testRunner.js) ---
const TEMP_BUILD_DIR = "build";
const C_SOURCE_DIR = "user_programs"; // Directory containing your C source files.
                            // Use '.' for the current directory, or specify a path like 'src'

// --- Helper Functions for C Test Runner (from testRunner.js) ---

/**
 * Compiles a C program.
 * Returns a Promise that resolves with { success: true, executablePath: string, output: string } on success,
 * or resolves with { success: false, executablePath: null, output: string } on failure.
 */
async function compileCProgram(cFilePath, outputExecutable) {
    if (!fs.existsSync(TEMP_BUILD_DIR)) {
        fs.mkdirSync(TEMP_BUILD_DIR, { recursive: true });
    }

    const outputPath = path.join(TEMP_BUILD_DIR, outputExecutable);
    let compilationOutput = ''; // To capture all output

    return new Promise((resolve) => {
        execFile('gcc', ['-Wall', '-Wextra', cFilePath, '-o', outputPath], (error, stdout, stderr) => {
            compilationOutput = stdout + stderr; // Combine for full output

            if (error) {
                if (error.code === 'ENOENT') {
                    compilationOutput += "\nError: 'gcc' command not found. Make sure GCC is installed and in your PATH.";
                }
                resolve({ success: false, executablePath: null, output: compilationOutput });
            } else {
                resolve({ success: true, executablePath: outputPath, output: compilationOutput });
            }
        });
    });
}

/**
 * Runs the compiled C program with given input and asserts the output.
 * Returns a Promise that resolves with { passed: boolean, message: string }
 */
async function runCTest(executablePath, testInput, expectedOutput) {
    return new Promise((resolve) => {
        execFile(executablePath, [testInput], (error, stdout, stderr) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // This error means the compiled executable wasn't found, which implies compilation likely failed earlier.
                }
                // Return detailed error message including any output from the C program
                resolve({ passed: false, message: `EXECUTION ERROR: Input '${testInput}'. Error: ${error.message}. Output:\n${stdout}\n${stderr}` });
            } else {
                const actualOutput = stdout.trim();

                if (actualOutput === expectedOutput) {
                    resolve({ passed: true, message: `PASSED: Input '${testInput}', Expected '${expectedOutput}', Got '${actualOutput}'` });
                } else {
                    resolve({ passed: false, message: `FAILED: Input '${testInput}', Expected '${expectedOutput}', Got '${actualOutput}'` });
                }
            }
        });
    });
}

/**
 * Returns a list of .c files in the specified directory.
 */
function getCFilesInDirectory(directory) {
    const cFiles = [];
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        for (const filename of files) {
            if (filename.endsWith(".c")) {
                cFiles.push(path.join(directory, filename));
            }
        }
    }
    return cFiles;
}

/**
 * Parses a multiline string of JSON test cases into a list of dictionaries.
 * Each line in the input string should be a valid JSON object.
 * This is used for parsing the 'unit_tests' array from the frontend.
 */
function parseTestString(testString) {
    const testCases = [];
    // Ensure testString is treated as a string, even if it's an array of strings.
    // If unitTests comes as an array of JSON strings directly, this parseTestString
    // might not be needed or would need adjustment. For consistency with prior
    // implementation that sent it as a single newline-separated string, we keep this.
    // However, if the frontend sends a direct array of strings like `['{"input":"a"}', '{"input":"b"}']`,
    // then testString will be `[object Object]` if not joined, or it will be `[ '{"input":"a"}', '{"input":"b"}' ]`
    // if the frontend sends `JSON.stringify({ unitTests: unitTests })` and `unitTests` is an array.
    // Re-evaluating the frontend's `body: JSON.stringify({ unitTests: unitTests })`
    // and the backend's `req.body.unitTests` implies `unitTests` is *already* an array of strings.
    // So, we should iterate directly if it's an array, or assume it's a newline-separated string.
    // For this combined file, let's adapt `parseTestString` to handle an array if passed,
    // or string if that's what's expected.

    // Given the frontend sends `JSON.stringify({ unitTests: unitTests })` where `unitTests` is already `string[]`
    // then `req.body.unitTests` will be `string[]`. Let's adjust `parseTestString` slightly to be more robust.
    let lines;
    if (Array.isArray(testString)) {
        lines = testString;
    } else {
        lines = testString.trim().split('\n');
    }

    for (const line of lines) {
        if (line) {
            try {
                testCases.push(JSON.parse(line));
            } catch (e) {
                console.warn(`Warning: Error parsing test case: ${line}. Error: ${e.message}`);
                // Skipping this test case, not necessarily a critical error for the overall process.
            }
        }
    }
    return testCases;
}

// Function to clean up temporary build directory
function cleanupBuildDir() {
    if (fs.existsSync(TEMP_BUILD_DIR)) {
        try {
            fs.readdirSync(TEMP_BUILD_DIR).forEach((item) => {
                const itemPath = path.join(TEMP_BUILD_DIR, item);
                if (fs.existsSync(itemPath) && fs.lstatSync(itemPath).isFile()) {
                    fs.unlinkSync(itemPath);
                }
            });
            fs.rmdirSync(TEMP_BUILD_DIR);
            console.log(`Cleanup complete for '${TEMP_BUILD_DIR}'.`);
        } catch (e) {
            console.error(`Error during cleanup of '${TEMP_BUILD_DIR}': ${e.message}`);
        }
    }
}


// --- API Routes (from express_backend.js) ---

// Helper function to simulate a Python problem generator
// In a real app, this might involve a direct Python subprocess or a call to an AI service
function generatePythonProblem() {
    const problemData = {
        "main_p": "Write a C function that reverses a string.",
        "hints": [
            "Consider iterating from both ends of the string.",
            "You might need a temporary variable for swapping characters."
        ],
        "unit_tests": [
            JSON.stringify({"input": "hello", "output": "olleh"}),
            JSON.stringify({"input": "madam", "output": "madam"}),
            JSON.stringify({"input": "a", "output": "a"}),
            JSON.stringify({"input": "", "output": ""}),
            JSON.stringify({"input": "racecar", "output": "racecar"})
        ]
    };
    return problemData;
}

// Route to simulate Python problem generation
app.post('/execute-python', (req, res) => {
    console.log('Received request for /execute-python');
    const problem = generatePythonProblem();
    res.json({ result: problem });
});

// Route to run C tests using the functions defined above
app.post('/run-tests', async (req, res) => {
    const unitTestsArray = req.body.unitTests; // This is directly the array of JSON strings

    if (!unitTestsArray || !Array.isArray(unitTestsArray) || unitTestsArray.length === 0) {
        return res.status(400).json({ error: "No unit tests provided or invalid format." });
    }

    // Since the frontend sends unitTests as an array of JSON strings,
    // we can pass it directly to parseTestString, which is now more robust.
    const testCases = parseTestString(unitTestsArray);

    if (testCases.length === 0) {
        cleanupBuildDir(); // Clean up even if no tests
        return res.json({ message: "No valid test cases found to run." });
    }

    const cFilesToTest = getCFilesInDirectory(C_SOURCE_DIR);

    if (cFilesToTest.length === 0) {
        cleanupBuildDir(); // Clean up even if no C files
        return res.json({ message: `No .c files found in '${C_SOURCE_DIR}'. Please ensure your C code is in this directory.` });
    }

    let overallOutput = [];
    let overallSuccess = true;

    try {
        for (const cFilePath of cFilesToTest) {
            const baseName = path.parse(cFilePath).name;
            overallOutput.push(`\n--- Processing C File: ${cFilePath} ---`);

            const { success: compilationSuccess, executablePath, output: compileDetails } = await compileCProgram(cFilePath, `${baseName}_exe`);

            if (compilationSuccess) {
                overallOutput.push(`Compilation successful for ${baseName}.`);
                if (compileDetails.trim()) {
                    overallOutput.push(`Compiler Output:\n${compileDetails.trim()}`);
                }

                for (let i = 0; i < testCases.length; i++) {
                    const testCase = testCases[i];
                    overallOutput.push(`\n--- Running Test Case ${i + 1} for ${baseName} ---`);
                    try {
                        const testInput = testCase.input;
                        const expectedOutput = testCase.output;

                        const { passed, message } = await runCTest(executablePath, testInput, expectedOutput);
                        overallOutput.push(message);
                        if (!passed) {
                            overallSuccess = false;
                        }
                    } catch (e) {
                        overallOutput.push(`ERROR: Test case missing 'input' or 'output' key for test case: ${JSON.stringify(testCase)}. Error: ${e.message}`);
                        overallSuccess = false;
                    }
                }
            } else {
                overallOutput.push(`Compilation FAILED for ${cFilePath}.`);
                if (compileDetails.trim()) {
                    overallOutput.push(`Compiler Output:\n${compileDetails.trim()}`);
                }
                overallSuccess = false;
            }
        }
    } catch (error) {
        console.error('An error occurred during test execution:', error);
        overallOutput.push(`FATAL ERROR during test execution: ${error.message}`);
        overallSuccess = false;
    } finally {
        cleanupBuildDir(); // Ensure cleanup happens regardless of success or failure
    }

    overallOutput.push("\n--- Test Summary ---");
    if (overallSuccess) {
        overallOutput.push("All tests PASSED!");
    } else {
        overallOutput.push("Some tests FAILED.");
    }

    // Send the accumulated output back to the frontend
    res.json({ message: overallOutput.join('\n') });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Express backend running on http://localhost:${PORT}`);
});