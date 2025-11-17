def review_code(code: str, model,language,file_name):
    prompt = f"You are a senior code reviewer.The filename of is {file_name}. Analyze and list issues in the following code:\n\n```{language} \n{code}\n```"
    outputs = model.generate(prompt)
    return outputs
