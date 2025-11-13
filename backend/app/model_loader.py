from transformers import Autotokenizer, AutoModelForCasualLM
import torch

def load_model():
    model_name="meta-llama/CodeLlama-7b-Instruct-hf"
    tokenizer=Autotokenizer.from_pretrained(model_name)
    model=AutoModelForCasualLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    return tokenizer,model