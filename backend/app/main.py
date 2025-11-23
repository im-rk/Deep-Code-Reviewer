from fastapi import FastAPI,Request
from app.model_loader import LLMclient
from app.review_service import review_code
from pydantic import BaseModel
import json
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
    print("Received code:", code[:100])  
    print("Starting generation...")
    result=review_code(code,llm,language,file_name)
    result=result[7:]
    result=result[:-3]
    result=result.strip()

    try:
        result_dict=json.loads(result)
        print(f"Parsed dictionary type: {type(result_dict)}")
        print(f"Parsed dictionary content: {result_dict}")
        return result_dict
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {"error": "Failed to parse JSON from LLM response", "details": str(e)}
