from fastapi import FastAPI,Request
from .model_loader import load_model
from .review_service import review_code


app=FastAPI()
tokenizer,model=load_model()

@app.post("/review_code")
async def review(request:Request):
    data=await request.json()
    code=data.get("code","")
    result=review_code(code,tokenizer,model)
    return {"review":result}