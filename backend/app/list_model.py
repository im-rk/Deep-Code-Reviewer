from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

print("Available models for your API key:\n")

models = client.models.list()

for model in models:
    print(f"- {model.name}")
    print(f"  type: {getattr(model, 'type', 'N/A')}")
    print(f"  description: {getattr(model, 'description', 'N/A')}")
    print(f"  supported_methods: {getattr(model, 'supported_methods', 'N/A')}")
    print()
