# Ghost In The C

## Overview

Ghost In The C is an interactive, web-based educational platform designed to help users practice C programming. It leverages a Large Language Model (LLM) to dynamically generate unique C programming exercises and provides an integrated, real-time terminal environment for users to develop and test their solutions.

The public deployment of the application is available at: http://100.27.217.193

## Local Setup Guide
1. Make sure you have [docker](https://www.docker.com/products/docker-desktop/) installed on your pc.
2. Obtain your personal Gemini API Key from the [Google AI studio](https://aistudio.google.com/app/api-keys).
3. Download the repository.
4. Navigate to the generator service directory: Project-Ghost-in-the-C/api/cgen/.
5. Copy your API Key into the .env file (agter you copy the key, it should be like the image below). ![Api key](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/env.png)
6. From the project's root directory execute the following command to build the whole project: ![docker compose build](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/docker_compose_build.png)
## How to use
1. Execute the following command to create a new session: ![docker compose up](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/docker_compose_up.png)
2. Visit the site at [localhost](http://localhost). If it got installed successfully, it should look like this: ![homepage](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/homepage.png)
3. Click the "Give me a problem" button to receive a C programming exercise.
4. Create a file named main.c where you will write your solution, with an editor of your choice (all the available editors are listed below). The command to use each of them to edit the file "main.c" is: ```"NAME_OF_THE_SELECTED_EDITOR" main.c```. ![micro command](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/micro_main.png)

This is an example that creates and edits the "main.c" file with the "micro" editor. ![micro](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/micro.png) 
5. Use the "Show Hints" button for tips on solving the problem  
6. Use the "Show Unit Tests" to view the expected input and the exact corresponding output for each test case.
7. Once your solution is complete, click "Test My Code" to validate your "main.c" file against the unit tests. If all tests passed, this will be displayed: ![all tests passed](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/all_tests_passed.png)
8. You can receive a new exercise by pressing the button "Give me a problem" again.
9. Close your session by executing the following command: ![docker compose down](https://github.com/piroar/Project-Ghost-in-the-C/blob/main/assets/docker_compose_down.png)

## Available Editors 
1. nano (command: nano main.c)
2. vim (command: vim main.c)
3. micro (command: micro main.c)
4. emacs (command: emacs main.c)





