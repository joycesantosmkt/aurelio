from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    database_url: str
    whatsapp_token: str
    whatsapp_phone_id: str
    whatsapp_webhook_secret: str
    secret_key: str
    environment: str = "development"
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
