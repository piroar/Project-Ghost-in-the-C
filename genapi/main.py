import sys
import uvicorn
from google import genai
from pydantic import BaseModel, Field
from typing_extensions import Annotated
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI


class UnitTest(BaseModel):
    args: Annotated[list[str], Field(description="A list of arguments to run the program with. These arguments are argv1 to argvN.")]
    output: Annotated[str, Field(description="The expected output of the program in stdout when run with the given arguments.")]
    exit_code: Annotated[int, Field(description="The expected exit code of the program when run with the given arguments. 0 means success, non-zero means failure.")]


class Problem(BaseModel):
    description: Annotated[str, Field(description="A description of a problem to solve in for students.")]
    hints: Annotated[list[str], Field(description="Hints to help solve the problem.")]
    unit_tests: Annotated[list[UnitTest], Field(description="A list of unit tests to validate the solution. Each test is a pair of input arguments and expected output.")]


client = genai.Client(api_key=os.getenv("API_KEY"))

app = FastAPI()


@app.get("/problem")
async def get_problem(prompt: str = "Provide me with a problem to solve in C following the format of the Problem model."):

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": Problem,
        },
    )
    return response.parsed


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--init":
        sys.exit(0)
    uvicorn.run(app, port=5000)
