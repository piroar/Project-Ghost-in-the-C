# Ghost In The C

It's a webapp that generates an exercise with the help of a LLM and gives the user a terminal to solve it along with some hints and unit tests. When the user finishes he can ask for his solution to be checked through these unit tests.

It consists of 5 services:

Web-The frontend of the websi0te. Implemented with Typescript, Css.

cgen-The generator of the exercises. Implemented with Python, Uvicorn, FastApi, Google-genai.

check-The tester of the solution. Implemented with Python, Flask.

shellinabox-An embedded web shell.

nginx-The proxy of the entire webapp.

The webapp runs on http://100.27.217.193 

In order to execute it locally, you need your own gemini api key (which you can obtain by this site https://aistudio.google.com/app/api-keys).
You must copy the key to the .env file (Project-Ghost-in-the-C/api/cgen/.env). The contents of the file after you copy it should be:
API_KEY = 1234...

After that you execute the following command to build the project(from the home directory):
sudo docker-compose build

Each time you want to create a new session, you use:
sudo docker-compose up

The website will be on http://localhost

And when you finish you run:
sudo docker-compose down
