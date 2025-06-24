# backend/app/services/parser.py
import fitz  # PyMuPDF
import docx  # The new library for Word documents
from fastapi import UploadFile
import io

async def extract_text_from_file(file: UploadFile) -> str:
    """
    Extracts text from an uploaded file (supports PDF and DOCX).
    """
    file_contents = await file.read()
    text = ""
    file_stream = io.BytesIO(file_contents)

    if file.filename.endswith(".pdf"):
        try:
            pdf_document = fitz.open(stream=file_stream, filetype="pdf")
            for page in pdf_document:
                text += page.get_text()
            pdf_document.close()
        except Exception as e:
            print(f"Error processing PDF file: {e}")
            return ""

    elif file.filename.endswith(".docx"):
        try:
            # Use the python-docx library to read the document
            document = docx.Document(file_stream)
            for para in document.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error processing DOCX file: {e}")
            return ""

    return text.strip()