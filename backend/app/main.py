from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import caixa, fiado, relatorios, whatsapp

app = FastAPI(
    title="Aurélio API",
    description="Sistema financeiro para comércio local",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(caixa.router, prefix="/caixa", tags=["Caixa"])
app.include_router(fiado.router, prefix="/fiado", tags=["Fiado"])
app.include_router(relatorios.router, prefix="/relatorios", tags=["Relatórios"])
app.include_router(whatsapp.router, prefix="/whatsapp", tags=["WhatsApp"])


@app.get("/")
def health_check():
    return {"status": "ok", "sistema": "Aurélio"}
