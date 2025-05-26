import subprocess
import os
import json

# Define a temporary directory for executables (optional, but good practice)
TEMP_BUILD_DIR = "build"
C_SOURCE_DIR = "." # Directory containing your C source files.
# Use '.' for the current directory, or specify a path like 'src'

def compile_c_program(c_file_path, output_executable):
    """
    Compiles a C program.
    Returns True on success, False on failure, and the path to the executable.
    """
    if not os.path.exists(TEMP_BUILD_DIR):
        os.makedirs(TEMP_BUILD_DIR)

    output_path = os.path.join(TEMP_BUILD_DIR, output_executable)
    print(f"Compiling {c_file_path} to {output_path}...")
    try:
        compile_result = subprocess.run(
            ["gcc", "-Wall", "-Wextra", c_file_path, "-o", output_path],
            capture_output=True,
            text=True,
            check=True
        )
        print("Compilation successful.")
        return True, output_path
    except subprocess.CalledProcessError as e:
        print(f"Compilation failed for {c_file_path}:")
        print(f"STDOUT:\n{e.stdout}")
        print(f"STDERR:\n{e.stderr}")
        return False, None
    except FileNotFoundError:
        print("Error: 'gcc' command not found. Make sure GCC is installed and in your PATH.")
        return False, None

def run_c_test(executable_path, test_input, output):
    """
    Runs the compiled C program with given input and asserts the output.
    Returns True if the test passes, False otherwise.
    """
    print(f"Running test for {executable_path} with input '{test_input}'...")
    try:
        run_result = subprocess.run(
            [executable_path, test_input],
            capture_output=True,
            text=True,
            check=True
        )
        actual_output = run_result.stdout.strip()

        if actual_output == output:
            print(f"Test PASSED. Output: '{actual_output}'")
            return True
        else:
            print(f"Test FAILED. Expected: '{output}', Got: '{actual_output}'")
            return False
    except subprocess.CalledProcessError as e:
        print(f"Test execution failed for {executable_path}:")
        print(f"STDOUT:\n{e.stdout}")
        print(f"STDERR:\n{e.stderr}")
        return False
    except FileNotFoundError:
        print(f"Error: Executable '{executable_path}' not found. Compilation might have failed.")
        return False

def get_c_files_in_directory(directory):
    """
    Returns a list of .c files in the specified directory.
    """
    c_files = []
    for filename in os.listdir(directory):
        if filename.endswith(".c"):
            c_files.append(os.path.join(directory, filename))
    return c_files

def parse_test_string(test_string):
    """
    Parses a multiline string of JSON test cases into a list of dictionaries.
    Each line in the input string should be a valid JSON object.
    """
    test_cases = []
    for line in test_string.strip().split('\n'):
        if line: # Ensure the line is not empty
            try:
                test_cases.append(json.loads(line))
            except json.JSONDecodeError as e:
                print(f"Error parsing test case: {line}. Error: {e}")
                print("Skipping this test case.")
    return test_cases

def main():
    # Example usage of the new parsing function:
    # This string would typically come from an external source, e.g., a file or user input.
    unit_tests_string = """
{"input":"madam","output":"madam"}
{"input":"hello","output":"olleh"}
{"input":"a","output":"a"}
{"input":"","output":""}
{"input":"racecar","output":"racecar"}
    """

    test_cases = parse_test_string(unit_tests_string)

    if not test_cases:
        print("No valid test cases found. Exiting.")
        return

    c_files_to_test = get_c_files_in_directory(C_SOURCE_DIR)

    if not c_files_to_test:
        print(f"No .c files found in '{C_SOURCE_DIR}'. Exiting.")
        return

    print(f"Found C file(s) to test: {c_files_to_test}")

    overall_success = True
    for c_file_path in c_files_to_test:
        # Extract base name without extension for executable name
        base_name = os.path.splitext(os.path.basename(c_file_path))[0]

        print(f"\n--- Processing C File: {c_file_path} ---")

        # Compile the C program
        executable_name = f"{base_name}_exe" # Unique name for each compiled C file
        compilation_success, executable_path = compile_c_program(c_file_path, executable_name)

        if compilation_success:
            for i, test_case in enumerate(test_cases):
                print(f"\n--- Running Test Case {i+1} for {base_name} ---")
                try:
                    test_input = test_case["input"]
                    output = test_case["output"]
                except KeyError as e:
                    print(f"Test case missing key: {e}. Skipping test case: {test_case}")
                    overall_success = False
                    continue

                test_passed = run_c_test(executable_path, test_input, output)
                if not test_passed:
                    overall_success = False
        else:
            print(f"Skipping tests for {c_file_path} due to compilation failure.")
            overall_success = False

    print("\n--- Test Summary ---")
    if overall_success:
        print("All tests PASSED!")
    else:
        print("Some tests FAILED.")

    # Clean up compiled executables
    print(f"\nCleaning up '{TEMP_BUILD_DIR}' directory...")
    if os.path.exists(TEMP_BUILD_DIR):
        for item in os.listdir(TEMP_BUILD_DIR):
            item_path = os.path.join(TEMP_BUILD_DIR, item)
            if os.path.isfile(item_path):
                os.remove(item_path)
        os.rmdir(TEMP_BUILD_DIR)
    print("Cleanup complete.")

if __name__ == "__main__":
    main()