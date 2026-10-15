from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Variables de entorno del servicio ml, validadas al arrancar (ADR 0012).

    Se leen solo del entorno del proceso. En desarrollo, el archivo .env lo carga el comando
    `npm run dev:ml` (uv run --env-file), de modo que las pruebas no dependan de él.
    """

    model_config = SettingsConfigDict(extra="ignore")

    ml_port: int = 8001
