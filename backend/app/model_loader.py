from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def load_model():
    model_name="meta-llama/CodeLlama-7b-Instruct-hf"
    tokenizer=AutoTokenizer.from_pretrained(model_name)
    model=AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    return tokenizer,model