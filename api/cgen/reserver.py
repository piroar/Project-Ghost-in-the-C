import sys
import uvicorn
from google import genai
from pydantic import BaseModel, Field
from typing_extensions import Annotated
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware

load_dotenv()

# Define the data models for the API
class UnitTest(BaseModel):
    args: Annotated[list[str], Field(description="A list of arguments to run the program with. These arguments are argv1 to argvN.")]
    output: Annotated[str, Field(description="The expected output of the program in stdout when run with the given arguments.")]
    exit_code: Annotated[int, Field(description="The expected exit code of the program when run with the given arguments. 0 means success, non-zero means failure.")]


class Problem(BaseModel):
    description: Annotated[str, Field(description="A description of a problem to solve in for students.")]
    hints: Annotated[list[str], Field(description="Hints to help solve the problem.")]
    unit_tests: Annotated[list[UnitTest], Field(description="A list of unit tests to validate the solution. Each test is a pair of input arguments and expected output.")]

# Initialize the Gemini client with the API key from environment variables
client = genai.Client(api_key=os.getenv("API_KEY"))

# Create the FastAPI application instance
app = FastAPI()

# Configure CORS middleware
# This allows requests from your frontend's origin (http://localhost:5173)
# You can customize `allow_origins`, `allow_credentials`, `allow_methods`, and `allow_headers` as needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define the API endpoint to get a problem
@app.get("/")
async def get_problem(prompt: str = "Provide me with a problem to solve in C following the format of the Problem model."):
    """
    Fetches a programming problem from the Gemini model based on a prompt.
    The response is structured according to the Problem Pydantic model.
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": Problem,
        },
    )
    # FastAPI automatically serializes Pydantic models, so returning response.parsed is correct.
    return response.parsed

# Main entry point for running the server
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--init":
        sys.exit(0)
    # Run the Uvicorn server on port 5000
    uvicorn.run(app, port=5000)

