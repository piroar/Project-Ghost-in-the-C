# Ghost In The C

## Overview

Ghost In The C is an interactive, web-based educational platform designed to help users practice C programming. It leverages a Large Language Model (LLM) to dynamically generate unique C programming exercises and provides an integrated, real-time terminal environment for users to develop and test their solutions.

The public deployment of the application is available at: http://100.27.217.193

## Local Setup Guide
1. Make sure you have docker installed on your pc.
2. Obtain your personal Gemini API Key from the [Google AI studio](https://aistudio.google.com/app/api-keys).
3. Download the repository.
4. Navigate to the generator service directory: Project-Ghost-in-the-C/api/cgen/.
5. Copy your API Key into the .env file (Example: API_KEY = 1234...).
6. From the project's root directory execute the following command to build the Docker images for all services: ```sudo docker compose build```
## How to use
1. Execute the following command to create a new session: ```sudo docker compose up```.
2. Visit the site at [localhost](http://localhost).
3. Click the "Give me a problem" button to receive a C programming exercise.
4. Create a file named main.c where you will write your solution, with an editor of your choice (all the available editors are listed below). The command to use each of them to edit the file "main.c" is: ```"NAME_OF_THE_SELECTED_EDITOR" main.c```.
5. Use the "Show Hints" button for tips on solving the problem  
6. Use the "Show Unit Tests" to view the expected input and the exact corresponding output for each test case.
7. Once your solution is complete, click "Test My Code" to validate your "main.c" file against the unit tests.
8. You can receive a new exercise by pressing the button "Give me a problem" again.
9. Close your session with ```sudo docker compose down```.

## Available Editors 
1. nano (command: nano main.c)
2. vim (command: vim main.c)
3. micro (command: micro main.c)
4. emacs (command: emacs main.c)


