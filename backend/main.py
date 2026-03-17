from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

app = FastAPI(title="AgriVerse Unified Backend API")

class QueryRequest(BaseModel):
    query: str
    top_k: int = 3

# Load Embeddings model
embedding_function = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load Vector Stores
icar_vectorstore = Chroma(persist_directory="VectorDatabases/embeddings/icar_db", embedding_function=embedding_function)
datagovin_vectorstore = Chroma(persist_directory="VectorDatabases/embeddings/datagovin_db", embedding_function=embedding_function)

@app.post("/api/icar/query")
def query_icar(data: QueryRequest):
    results = icar_vectorstore.similarity_search(data.query, k=data.top_k)
    if results:
        combined_text = "\n\n".join([doc.page_content for doc in results])
        return {"context": combined_text}
    return {"context": "No relevant information found in ICAR details."}

@app.post("/api/datagovin/query")
def query_datagovin(data: QueryRequest):
    results = datagovin_vectorstore.similarity_search(data.query, k=data.top_k)
    if results:
        combined_text = "\n\n".join([doc.page_content for doc in results])
        return {"context": combined_text}
    return {"context": "No relevant policy or finance information found."}
