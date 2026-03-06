from gpt4all import GPT4All

model = GPT4All("gpt4all-lora-quantized.bin")

while True:
    prompt = input("You: ")
    if prompt.lower() in ["exit", "quit"]:
        break
    response = model.generate(prompt)
    print("AI:", response)