FROM python:3.10-slim

WORKDIR /app

# System deps (if you need git-lfs or such)
RUN apt-get update && apt-get install -y git-lfs && rm -rf /var/lib/apt/lists/*

# Copy your entire prompt folder (this includes app.py, requirements.txt, etc)
COPY prompt/ ./prompt/

# Copy your fine-tuned weights
COPY blenderbot_90m_finetuned_ct/ ./blenderbot_90m_finetuned_ct/

# Install Python deps
RUN pip install --no-cache-dir -r prompt/requirements.txt

EXPOSE 8000

# Run from inside the prompt folder
CMD ["uvicorn", "prompt.app:app", "--host", "0.0.0.0", "--port", "8000"]
