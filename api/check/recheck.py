import os
import subprocess
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/run-tests": {"origins": "*"}})

class UnitTest:
    def __init__(self, args, output, exit_code):
        self.args = args
        self.output = output
        self.exit_code = exit_code

def find_c_files(base_path):
    c_files = []
    for root, dirs, files in os.walk(base_path):
        if 'main.c' in files:
            c_files.append(os.path.join(root, 'main.c'))
    return c_files


@app.route('/run-tests', methods=['POST'])
def run_tests():
    """
    Receives unit tests from the frontend, compiles and executes C programs
    found in subdirectories within the mounted volume, and returns the test results.
    """
    data = request.get_json()
    unit_tests_json_strings = data.get('unitTests', [])

    if not unit_tests_json_strings:
        return jsonify({"error": "No unit tests provided."}), 400

    unit_tests = []
    for test_str in unit_tests_json_strings:
        try:
            test_data = json.loads(test_str)
            unit_tests.append(
                UnitTest(
                    args=test_data.get('args', []),
                    output=test_data.get('output', ''),
                    exit_code=test_data.get('exit_code', 0)
                )
            )
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid unit test JSON format."}), 400

    results = []
    user_programs_base_path = '/app/user_programs'

    c_source_files = find_c_files(user_programs_base_path)

    if not c_source_files:
        return jsonify({"message": "No C programs (main.c) found in subdirectories within user_programs volume to test."}), 200

    for c_file_path in c_source_files:
        c_dir = os.path.dirname(c_file_path)
        executable_path = os.path.join(c_dir, 'a.out')
        program_name = os.path.basename(c_dir) 

        compile_command = ['gcc', c_file_path, '-o', executable_path]

        try:
            compile_process = subprocess.run(
                compile_command,
                capture_output=True,
                text=True,
                check=True
            )
            if compile_process.stderr:
                results.append(f"Program '{program_name}' (Path: {c_file_path}) compiled with warnings: {compile_process.stderr.strip()}")

        except subprocess.CalledProcessError as e:
            results.append(f"Program '{program_name}' (Path: {c_file_path}) FAILED TO COMPILE. Error: {e.stderr.strip()}")
            continue
        except FileNotFoundError:
            results.append(f"Program '{program_name}' (Path: {c_file_path}) FAILED TO COMPILE. 'gcc' command not found. Ensure build-essential is installed and PATH is correct.")
            continue
        except Exception as e:
            results.append(f"Program '{program_name}' (Path: {c_file_path}) FAILED TO COMPILE due to an unexpected error: {e}")
            continue

        program_tests_passed = True
        for i, test in enumerate(unit_tests):
            execute_command = [executable_path] + test.args

            try:
                execute_process = subprocess.run(
                    execute_command,
                    capture_output=True,
                    text=True,
                    timeout=5
                )

                actual_output = execute_process.stdout.strip()
                actual_exit_code = execute_process.returncode

                output_matches = (actual_output == test.output.strip())
                exit_code_matches = (actual_exit_code == test.exit_code)

                if output_matches and exit_code_matches:
                    results.append(f"Program '{program_name}' - Test {i+1} PASSED.")
                else:
                    program_tests_passed = False
                    details = []
                    if not output_matches:
                        details.append(f"Output Mismatch: Expected '{test.output.strip()}', Got '{actual_output}'")
                    if not exit_code_matches:
                        details.append(f"Exit Code Mismatch: Expected {test.exit_code}, Got {actual_exit_code}")
                    results.append(f"Program '{program_name}' - Test {i+1} FAILED. {' '.join(details)}")

                if execute_process.stderr:
                    results.append(f"Program '{program_name}' - Test {i+1} generated stderr: {execute_process.stderr.strip()}")

            except subprocess.TimeoutExpired:
                program_tests_passed = False
                results.append(f"Program '{program_name}' - Test {i+1} FAILED: Timeout (program took too long to execute).")
                if execute_process.stdout:
                    results.append(f"  Partial output: {execute_process.stdout.strip()}")
                if execute_process.stderr:
                    results.append(f"  Partial stderr: {execute_process.stderr.strip()}")
            except FileNotFoundError:
                program_tests_passed = False
                results.append(f"Program '{program_name}' - Test {i+1} FAILED: Executable not found. (This should not happen if compilation was successful).")
            except Exception as e:
                program_tests_passed = False
                results.append(f"Program '{program_name}' - Test {i+1} FAILED due to an unexpected error during execution: {e}")

        if os.path.exists(executable_path):
            try:
                os.remove(executable_path)
                results.append(f"Cleaned up executable for '{program_name}'.")
            except OSError as e:
                results.append(f"Could not remove executable for '{program_name}': {e}")

    if not results:
        final_message = "No C programs found or no tests were run."
    elif all("PASSED" in r for r in results) and all("FAILED" not in r for r in results):
        final_message = "All found C programs passed all unit tests!"
    else:
        final_message = "Some C programs failed unit tests."

    return jsonify({"message": "\n".join(results), "summary": final_message}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5172, debug=True)