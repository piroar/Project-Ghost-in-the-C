import sys
import uvicorn
from google import genai
from pydantic import BaseModel, Field
from typing_extensions import Annotated
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

load_dotenv()

problem_history: List[str] = []

class UnitTest(BaseModel):
    args: Annotated[list[str], Field(description="A list of arguments to run the program with. These arguments are argv1 to argvN.")]
    output: Annotated[str, Field(description="The expected output of the program in stdout when run with the given arguments.")]
    exit_code: Annotated[int, Field(description="The expected exit code of the program when run with the given arguments. 0 means success, non-zero means failure.")]


class Problem(BaseModel):
    description: Annotated[str, Field(description="A description of a problem to solve for students.")]
    hints: Annotated[list[str], Field(description="Hints to help solve the problem.")]
    unit_tests: Annotated[list[UnitTest], Field(description="A list of unit tests to validate the solution. Each test is a pair of input arguments and expected output.")]

client = genai.Client(api_key=os.getenv("API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get_problem(prompt: str = "Provide me with a single, simple, unique programming problem to solve in C following the format of the Problem model."):
    """
    Fetches a programming problem from the Gemini model, excluding problems in the history.
    """
    global problem_history

    current_prompt = prompt
    if problem_history:
        history_str = "\n".join([f"- {p}" for p in problem_history])
        current_prompt += f"\n\nDO NOT provide any of the following problems, only return a new, unique problem that is distinct from all of them:\n{history_str}"
    
    print(f"[Problem Request] Sending prompt to Gemini with history size: {len(problem_history)}")
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=current_prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": Problem,
            },
        )
        
        new_problem: Problem = response.parsed
        
        problem_history.append(new_problem.description)
        
        print(f"[History Update] New problem added. Current history size: {len(problem_history)}")
        print(f"[History List] Last 5 entries: {problem_history[-5:]}")
        
        return new_problem
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return Problem(
            description="Failed to fetch a new problem. Please solve: Write a C program that prints 'Hello, World!'",
            hints=["Ensure your program includes stdio.h", "Use the printf function"],
            unit_tests=[UnitTest(args=[], output="Hello, World!\n", exit_code=0)]
        )

@app.get("/history")
async def get_history():
    global problem_history
    return {"history": problem_history}


@app.post("/clear_history")
async def clear_history():
    global problem_history
    problem_history.clear()
    
    print(f"[History Update] History successfully cleared. Current size: {len(problem_history)}")
    
    return {"message": "Problem history successfully cleared. History is now empty."}

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--init":
        sys.exit(0)
    uvicorn.run(app, host="0.0.0.0", port=5000)
