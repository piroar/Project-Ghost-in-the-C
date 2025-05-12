import sys
sys.path.insert(0, "/app/venv/lib/python3.12/site-packages")
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')
response = model.generate_content("Can you give me a programming problem to solve in c")
print(response.text)