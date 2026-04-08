from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any
import os
import uuid
import tempfile

from generators.pptx_gen import gerar_apresentacao
from generators.docx_gen import gerar_trabalho, gerar_resumo
from generators.pdf_gen import gerar_prova, gerar_plano

app = FastAPI(title="Manja.ai - File Generator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FILE_SERVICE_SECRET = os.getenv("FILE_SERVICE_SECRET", "manja_secret_interno_123")


def verificar_token(authorization: Optional[str] = Header(None)):
    if not authorization or authorization != f"Bearer {FILE_SERVICE_SECRET}":
        raise HTTPException(status_code=401, detail="Token inválido")


class FileRequest(BaseModel):
    tipo: str
    titulo: str
    subtitulo: Optional[str] = None
    conteudo: Any


@app.get("/health")
def health():
    return {"status": "ok", "service": "manja-files"}


@app.post("/gerar")
async def gerar_arquivo(req: FileRequest, authorization: Optional[str] = Header(None)):
    verificar_token(authorization)

    with tempfile.TemporaryDirectory() as tmpdir:
        filename = f"{uuid.uuid4()}"

        try:
            if req.tipo == "apresentacao":
                filepath = os.path.join(tmpdir, f"{filename}.pptx")
                gerar_apresentacao(req.titulo, req.subtitulo, req.conteudo, filepath)
                media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                ext = "pptx"

            elif req.tipo == "trabalho":
                filepath = os.path.join(tmpdir, f"{filename}.docx")
                gerar_trabalho(req.titulo, req.subtitulo, req.conteudo, filepath)
                media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ext = "docx"

            elif req.tipo == "resumo":
                filepath = os.path.join(tmpdir, f"{filename}.docx")
                gerar_resumo(req.titulo, req.subtitulo, req.conteudo, filepath)
                media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ext = "docx"

            elif req.tipo == "prova":
                filepath = os.path.join(tmpdir, f"{filename}.pdf")
                gerar_prova(req.titulo, req.conteudo, filepath)
                media_type = "application/pdf"
                ext = "pdf"

            elif req.tipo == "plano":
                filepath = os.path.join(tmpdir, f"{filename}.pdf")
                gerar_plano(req.titulo, req.conteudo, filepath)
                media_type = "application/pdf"
                ext = "pdf"

            else:
                raise HTTPException(status_code=400, detail=f"Tipo '{req.tipo}' não suportado")

            slug = req.titulo.lower()[:40].replace(" ", "-")
            slug = "".join(c for c in slug if c.isalnum() or c == "-")

            # Lê os bytes DENTRO do with, antes do tempdir ser apagado
            with open(filepath, "rb") as f:
                file_bytes = f.read()

            return Response(
                content=file_bytes,
                media_type=media_type,
                headers={"Content-Disposition": f'attachment; filename="{slug}.{ext}"'},
            )

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao gerar arquivo: {str(e)}")
