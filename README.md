#Ghost In The C
It's a webapp that generates an exercise with the help of a LLM and gives the user a terminal to solve along with some hints and unit tests. When the user finishes he can ask for his solution to be checked through these unit tests.

It consists of 5 services:
Web-The frontend of the website 
cgen-The generator of the exercises
check-The tester of the solution 
shellinabox-An embedded web shell
nginx-The proxy of the entire webapp

The webapp runs on http://100.27.217.193 
