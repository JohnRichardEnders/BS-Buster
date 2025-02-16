# import argparse
# import asyncio
import json
from typing import Dict, Any
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv


def load_api_key() -> str:
    """Load API key from .env file"""
    load_dotenv()
    api_key = os.getenv("KIMI_API_KEY")
    if not api_key:
        raise ValueError(
            "API key not found. Please ensure OPENAI_API_KEY is set in your .env file."
        )
    return api_key


async def verify_claim(claim: str) -> Dict[str, Any]:
    """Asynchronously perform a fact-check request using Moonshot API"""
    api_key = load_api_key()
    async_client = AsyncOpenAI(
        api_key=api_key, base_url="https://api.perplexity.ai"
    )

    messages = [
        {
            "role": "system",
            "content": """You are a fact-checking AI. Your task is to verify specific, factual claims by searching the internet.
            For personal anecdotes or clearly non-verifiable claims (like personal feelings or future predictions), respond with {"result": "Unverifiable", "reason": "This is a personal anecdote/statement that cannot be independently verified"}.
            
            For ALL OTHER claims, you MUST PERFORM A WEB SEARCH before responding, even if you think you know the answer.
            Respond in the following JSON format:
            - For true claims: {"result": "True", "correction": "corrected fact""source": "source URL"}
            - For false claims: {"result": "False", "correction": "corrected fact", "source": "source URL"}
            
            IMPORTANT: 
            - Always provide your answer in English
            - You MUST search for every claim unless it's clearly unverifiable
            - Only skip searching for obviously personal statements or non-verifiable claims
            - Always include a source URL for verifiable claims
            
            Do not include any other text or explanations outside the JSON structure.""",
        },
        {"role": "user", "content": f"Fact-check this claim: {claim}"},
    ]

    try:
        while True:
            completion = await async_client.chat.completions.create(
                model="sonar-pro",
                messages=messages,
                temperature=0.1,
                # tools=[
                #     {
                #         "type": "builtin_function",
                #         "function": {
                #             "name": "$web_search",
                #         },
                #     }
                # ],
                # response_format={"type": "json_schema"},
            )

            choice = completion.choices[0]

            # If the model wants to use a tool
            if choice.finish_reason == "tool_calls":
                messages.append(choice.message)

                for tool_call in choice.message.tool_calls:
                    # Pass the search arguments back to the model
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": tool_call.function.name,
                            "content": tool_call.function.arguments,
                        }
                    )
                continue

            # If we have a final response
            if choice.finish_reason == "stop":
                try:
                    response_content = choice.message.content
                    ai_response = json.loads(response_content)
                    return {"claim": claim, **ai_response}
                except json.JSONDecodeError as e:
                    return {
                        "claim": claim,
                        "error": f"Failed to parse AI response into JSON format: {str(e)}",
                        "raw_response": response_content,
                    }

    except Exception as e:
        print("Error:", e)
        return {"error": e}


# async def main() -> None:
#     parser = argparse.ArgumentParser(
#         description="Moonshot AI Async Fact-Checker"
#     )
#     parser.add_argument("claim", help="The statement to fact-check")
#     args = parser.parse_args()

#     result = await get_fact_check(args.claim)

#     print(json.dumps(result, ensure_ascii=False, indent=2))


# if __name__ == "__main__":
#     asyncio.run(main())
