import sys
sys.path.insert(0, "/app/venv/lib/python3.12/site-packages")
import google.generativeai as genai

genai.configure(api_key="AIzaSyD7t_aKxwM3xV4Mgfp0pSI00yhTncrdtSU")
model = genai.GenerativeModel('gemini-2.0-flash')
response = model.generate_content("Do my parents love me if i code in java?")
print(response.text)