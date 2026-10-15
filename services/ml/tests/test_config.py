# T-021 — ADR 0012: la configuración del servicio ml se valida al arrancar.
import pytest
from pydantic import ValidationError

from ghostwall_ml.config import Settings


def test_usa_el_puerto_por_defecto_si_ml_port_no_esta_definido(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("ML_PORT", raising=False)
    assert Settings().ml_port == 8001


def test_lee_ml_port_del_entorno(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ML_PORT", "9000")
    assert Settings().ml_port == 9000


def test_rechaza_un_ml_port_no_numerico(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ML_PORT", "abc")
    with pytest.raises(ValidationError):
        Settings()


def test_no_lee_archivos_env_del_disco() -> None:
    # Aislamiento: las pruebas no deben depender del .env local de cada integrante.
    assert Settings.model_config.get("env_file") is None
