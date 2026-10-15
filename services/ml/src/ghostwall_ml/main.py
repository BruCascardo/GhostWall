from typing import Literal

from fastapi import FastAPI

from ghostwall_ml.config import Settings

settings = Settings()

app = FastAPI(title="GhostWall ML")


@app.get("/health")
def health() -> dict[str, Literal["ok"]]:
    return {"status": "ok"}
