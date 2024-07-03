from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai
import docx2txt
import fitz  # PyMuPDF
from typing import List
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

class SummarizationRequest(BaseModel):
    text: str
    length: str

class ChatRequest(BaseModel):
    document_text: str
    query: str

class NERRequest(BaseModel):
    text: str

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
    
    return {"text": "HI"}

@app.post("/summarize/")
async def summarize(request: SummarizationRequest):
    prompt = f"Summarize this text in a {request.length} way: {request.text}"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
    )
    summary = response.choices[0].text.strip()
    return {"summary": summary}

@app.post("/chat/")
async def chat(request: ChatRequest):
    prompt = f"Document: {request.document_text}\n\nQuestion: {request.query}\nAnswer:"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
    )
    answer = response.choices[0].text.strip()
    return {"answer": answer}

'''@app.post("/ner/")
async def named_entity_recognition(request: NERRequest):
    prompt = f"Identify and highlight key entities (e.g., names, locations, organizations) in the following text: {request.text}"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
    )
    ner_result = response.choices[0].text.strip()
    return {"entities": ner_result}'''

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)