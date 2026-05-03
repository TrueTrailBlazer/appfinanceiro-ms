from fastapi import FastAPI

app = FastAPI()

# Substitua a rota atual por esta:
@app.get("/")
def read_root():
    return {
        "service": "Automation", 
        "message": "Serviço de processamento de arquivos CSV e rotinas pesadas pronto!", 
        "status": "Operacional"
    }