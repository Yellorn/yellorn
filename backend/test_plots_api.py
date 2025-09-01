import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.plots_api import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_get_plots():
    r = client.get("/plots")
    assert r.status_code == 200
    data = r.json()
    assert "plots" in data
    assert isinstance(data["plots"], list)
    assert "errors" in data
    assert isinstance(data["errors"], list)

def test_get_plot_by_id():
    r = client.get("/plots/example_plot")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "example_plot"
    assert data["owner"] == "example_user"
    assert data["position"] == [0, 0] or tuple(data["position"]) == (0, 0)
    assert data["size"] == [3, 3] or tuple(data["size"]) == (3, 3)
