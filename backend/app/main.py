from fastapi import FastAPI,Request
from app.model_loader import LLMclient
from app.review_service import review_code
from pydantic import BaseModel

# Define request schema
class CodeRequest(BaseModel):
    code: str
    language: str | None=None
    fileName: str | None=None

app=FastAPI()
llm=LLMclient()

@app.post("/review_code")
async def review(request:CodeRequest):
    code=request.code
    language=request.language
    file_name=request.fileName
    print("Received code:", code[:100])  # first 100 chars
    print("Starting generation...")
    result=review_code(code,llm,language,file_name)
    return {"review":result}