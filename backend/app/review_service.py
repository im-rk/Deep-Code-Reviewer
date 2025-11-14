def review_code(code: str, model):
    prompt = f"You are a senior code reviewer. Analyze and list issues in the following code:\n\n```python\n{code}\n```"
    outputs = model.generate(prompt)
    return outputs
