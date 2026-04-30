from sqlalchemy import Column, String, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base


class TipoLancamento(str, enum.Enum):
    entrada = "entrada"
    saida = "saida"


class Lancamento(Base):
    __tablename__ = "lancamentos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comercio_id = Column(UUID(as_uuid=True), ForeignKey("comercios.id"), nullable=False)
    descricao = Column(String(255), nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    tipo = Column(Enum(TipoLancamento), nullable=False)
    categoria = Column(String(100))
    data = Column(DateTime, default=datetime.utcnow)
    criado_em = Column(DateTime, default=datetime.utcnow)
