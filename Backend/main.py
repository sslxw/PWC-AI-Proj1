from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import docx2txt
import fitz  # PyMuPDF
from typing import List, Dict, Any
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizationRequest(BaseModel):
    text: str
    length: str
    detail: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatHistory(BaseModel):
    history: List[ChatMessage]
    document_text: str
    entities: str = ""  # Default to empty string if not provided

@app.post("/upload/")
async def upload_file(file: UploadFile):
    if file.filename.endswith(".docx"):
        text = docx2txt.process(file.file)
    elif file.filename.endswith(".pdf"):
        pdf_document = fitz.open(stream=file.file.read(), filetype="pdf")
        text = ""
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text()
    else:
        return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

    # Perform NER on the extracted text
    prompt = f"Identify and highlight key entities (e.g., names, locations, organizations) in the following text: {text}"
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Please highlight the following entities in the document (e.g., names, locations, and organizations) and put them in the following format: Names: /n Locations: /n Organizations: /n and if any of them are empty write nothing."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=4000
    )
    ner_result = response['choices'][0]['message']['content']
    return {"text": text, "entities": ner_result}

@app.post("/summarize/")
async def summarize(request: SummarizationRequest):
    prompt = f"Summarize this text in a {request.length} way with {request.detail} detail: {request.text}"
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides concise summaries of the text provided."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=4000
    )
    summary = response['choices'][0]['message']['content']
    return {"summary": summary}

@app.post("/chat/")
async def chat(request: ChatHistory):
    system_message = {
        "role": "system",
        "content": f"Only answer questions that are related to the document and entities. If they are not related, apologize and say you can't answer it. Document: {request.document_text}\n\nEntities: {request.entities}."
    }
    messages = [system_message] + [{"role": msg.role, "content": msg.content} for msg in request.history]
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=4000
    )
    answer = response['choices'][0]['message']['content']
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
