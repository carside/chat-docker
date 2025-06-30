# app.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from peft import PeftModel

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    generated: str

app = FastAPI()
# Allow your front-end origin to talk to FastAPI
app.add_middleware(
  CORSMiddleware,
#   allow_origins=["http://localhost:5173"],  # ← your React dev server
  allow_origins=["*"],     # <-- ANY origin is allowed
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# 1) load base model and tokenizer at import time
tokenizer = AutoTokenizer.from_pretrained("facebook/blenderbot_small-90M")
base_model = AutoModelForSeq2SeqLM.from_pretrained("facebook/blenderbot_small-90M")
# 2) attach the LoRA adapter (or any adapter) that you’ve fine-tuned
# model = PeftModel.from_pretrained(base_model, "../blenderbot_90m_finetuned_ct", is_trainable=False)
model = PeftModel.from_pretrained(base_model, "blenderbot_90m_finetuned_ct", is_trainable=False)

# model.to("cuda")

@app.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    inputs = tokenizer(
        req.prompt,
        return_tensors="pt",
        truncation=True,
        padding=True,
    ).to(model.device)
    outputs = model.generate(
        **inputs,
        num_beams=4,
        max_length=64,
        early_stopping=True,
    )
    text = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
    return GenerateResponse(generated=text)
