# Pruebas HTTP del servicio ml en memoria (sin red externa).
from fastapi.testclient import TestClient

from ghostwall_ml.main import app

client = TestClient(app)


def test_health_responde_ok() -> None:
    respuesta = client.get("/health")
    assert respuesta.status_code == 200
    assert respuesta.json() == {"status": "ok"}


def test_una_ruta_inexistente_responde_404() -> None:
    assert client.get("/no-existe").status_code == 404
