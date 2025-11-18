from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()
class LLMclient:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model="models/gemini-2.0-flash-001",
            google_api_key=os.getenv("GOOGLE_API_KEY"),  
            convert_system_message_to_human=True,
            temperature=0.65
        )
    
    def generate(self,prompt):
        system_template = '''
            You are an expert AI Code Reviewer.

            Your goal:
            - Analyze the provided code thoroughly.
            - Detect bugs, logical errors, anti-patterns, security vulnerabilities,
            performance issues, and style problems.
            - Suggest clear, actionable fixes.

            Rules:
            - Do NOT rewrite entire code unless necessary.
            - Keep feedback concise, structured, and developer-friendly.
            - Prioritize correctness and security over style.
            - If code is incomplete or ambiguous, mention assumptions.
            - Ensure strict JSON compliance.

            VERY IMPORTANT:
            - Return ONLY a valid JSON object.
            - Do NOT include backticks, markdown, comments, or text outside JSON.
            - Do NOT explain anything outside the expected JSON output format.

            JSON Format:
            {{
                "summary": "",
                "issues": [
                    {{
                        "type": "bug | security | performance | style | best_practice",
                        "description": "",
                        "line": "",
                        "suggestion": ""
                    }}
                ],
                "overall_suggestion": ""
            }}
            '''


        chat_prompt=ChatPromptTemplate.from_messages(
            [
                ("system",system_template),
                ("user","{prompt}")
            ]
        )
        chain=chat_prompt|self.model
        response= chain.invoke({"prompt":prompt})
        return response.content
