import sys
sys.path.insert(0, "/app/venv/lib/python3.12/site-packages")
from google import genai
from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv()

class problem(BaseModel):
    main_p: str
    hints: list[str]

client = genai.Client(api_key=os.getenv("API_KEY"))
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="give me a problem to solve in c and some hints",
    config={
        "response_mime_type": "application/json",
        "response_schema": list[problem],
    },
)
print(response.text)
my_prob: list[problem] = response.parsed