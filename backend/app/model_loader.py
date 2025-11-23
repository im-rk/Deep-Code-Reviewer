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
            - Detect issues strictly in the following priority order:
                1. Syntax or compiler errors (highest priority)
                2. Logical bugs or incorrect behavior
                3. Security vulnerabilities
                4. Performance issues
                5. Style issues (only if no higher-priority issues exist)

            Line Numbering Rules:
            - Count every line exactly as provided.
            - Do not ignore blank lines or comments.
            - Do not collapse, format, or normalize whitespace.
            - Line numbers in the output must match EXACTLY the original input text.

            Your Responsibilities:
            - Suggest clear, actionable fixes.
            - Provide the exact corrected code snippet for each issue (only the changed segment).
            - Do NOT rewrite the entire file.
            - Keep explanations concise.
            - If code is incomplete or ambiguous, state assumptions.

            STRICT JSON RULES:
            - Return ONLY valid JSON.
            - NO backticks.
            - NO markdown.
            - NO additional comments.
            - JSON Format:
            {{
                "summary": "",
                "issues": [
                    {{
                        "type": "bug | security | performance | style | best_practice",
                        "description": "",
                        "line": "",
                        "suggestion": "",
                        "corrected":""
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
