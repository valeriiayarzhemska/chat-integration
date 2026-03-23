from gpt4all import GPT4All
import sys, json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "models", "qwen2-1_5b-instruct-q4_0.gguf")

model = GPT4All(model_path)

input_data = json.loads(sys.stdin.read())
messages = input_data["messages"]

conversation = ""
for msg in messages:
    role = msg["role"]
    content = msg["content"]
    if role == "user":
        conversation += f"User: {content}\n"
    elif role == "assistant":
        conversation += f"Assistant: {content}\n"

# Add prompt for the assistant to respond
conversation += "Assistant:"

response = model.generate(conversation, max_tokens=500)

print(json.dumps({"role": "assistant", "content": response}))
sys.stdout.flush()