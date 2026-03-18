import os
import json
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

DB_DIR = "./embeddings/datagovin_db"
if os.path.exists(DB_DIR) and os.listdir(DB_DIR):
    print(f"Vector DB already exists at {DB_DIR}. Skipping generation.")
else:
    with open("./data/datagovin/finance.json", "r") as f:
        json_data = json.load(f)

    all_documents = []
    if isinstance(json_data, list):
        for item in json_data:
            content = json.dumps(item, indent=2)
            doc = Document(page_content=content)
            all_documents.append(doc)
    else:
        content = json.dumps(json_data, indent=2)
        doc = Document(page_content=content)
        all_documents.append(doc)

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    docs = splitter.split_documents(all_documents)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vectorstore = Chroma.from_documents(
        docs,
        embeddings,
        persist_directory=DB_DIR
    )
    vectorstore.persist()
    print("Vector DB generated successfully.")
