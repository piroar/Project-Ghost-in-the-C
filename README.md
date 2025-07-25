# Ghost In The C

It's a webapp that generates an exercise with the help of a LLM and gives the user a terminal to solve it along with some hints and unit tests. When the user finishes he can ask for his solution to be checked through these unit tests.

It consists of 5 services:

Web-The frontend of the websi0te. Implemented with Typescript, Css.

cgen-The generator of the exercises. Implemented with Python, Uvicorn, FastApi, Google-genai.

check-The tester of the solution. Implemented with Python, Flask.

shellinabox-An embedded web shell.

nginx-The proxy of the entire webapp.

The webapp runs on http://100.27.217.193 
