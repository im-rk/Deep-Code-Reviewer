from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def load_model():
    model_name = "deepseek-ai/deepseek-coder-1.3b-instruct"
    print("✅ Loading model...")
    tokenizer=AutoTokenizer.from_pretrained(model_name)
    model=AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map="auto",
        load_in_4bit=True
    )
    print("✅ Model loaded successfully!")
    return tokenizer,model