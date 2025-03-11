from google import genai
client=genai.Client(api_key="AIzaSyD7t_aKxwM3xV4Mgfp0pSI00yhTncrdtSU")
response=client.models.generate_content(model="gemini-2.0-flash", contents="Give me a problem to solve with C programming.")
print(response.text)