
def review_code(code:str,tokenizer,model):
    prompt = f"You are a senior code reviewer. Analyze and list issues in the following code:\n\n```python\n{code}\n```"
    inputs=tokenizer(prompt,return_tensors="pt").to(model.device)
    outputs= model.generate(**inputs, max_length=400)
    review=tokenizer.decode(outputs[0],skip_special_tokens=True)
    return review