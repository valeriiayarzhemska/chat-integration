from gpt4all import GPT4All
import sys, json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "models", "qwen2-1_5b-instruct-q4_0.gguf")

model = GPT4All(model_path)

prompt = json.loads(sys.stdin.read())["prompt"]

response = model.generate(prompt)

print(json.dumps({"role": "assistant", "content": response}))
sys.stdout.flush()