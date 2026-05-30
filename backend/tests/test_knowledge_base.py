"""Tests for the knowledge base and API."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from main import app
from services.knowledge_base import KnowledgeBase


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def kb():
    k = KnowledgeBase()
    k.load()
    return k


class TestKnowledgeBase:
    def test_loads_commands(self, kb):
        assert kb.command_count > 40

    def test_loads_tools(self, kb):
        assert kb.tool_count > 15

    def test_loads_phases(self, kb):
        assert len(kb.phases) == 7

    def test_loads_mitre(self, kb):
        assert len(kb.mitre_techniques) >= 15

    def test_search_nmap(self, kb):
        results = kb.search_commands("nmap")
        assert len(results) >= 5

    def test_search_sql(self, kb):
        results = kb.search_commands("sql")
        assert len(results) >= 1

    def test_filter_by_phase(self, kb):
        results = kb.filter_commands(phase=1)
        assert len(results) >= 5
        assert all(c["phase"] == 1 for c in results)

    def test_filter_by_tool(self, kb):
        results = kb.filter_commands(tool="nmap")
        assert len(results) >= 3
        assert all(c["tool"] == "nmap" for c in results)

    def test_filter_by_os(self, kb):
        results = kb.filter_commands(os="linux")
        assert len(results) > 20

    def test_get_command_by_id(self, kb):
        cmd = kb.get_command("nmap-basic-scan")
        assert cmd is not None
        assert cmd["tool"] == "nmap"

    def test_get_nonexistent_command(self, kb):
        cmd = kb.get_command("nonexistent-xyz")
        assert cmd is None

    def test_categories(self, kb):
        cats = kb.get_categories()
        assert "reconnaissance" in cats
        assert "web_testing" in cats

    def test_command_schema(self, kb):
        """Every command has required fields."""
        required = ["id", "tool", "category", "phase", "os", "command", "name",
                   "description", "arguments", "mitre_mapping", "mitre_tactic",
                   "detections", "remediation", "tags"]
        for cmd in kb.commands:
            for field in required:
                assert field in cmd, f"Command {cmd.get('id', '?')} missing field: {field}"


class TestAPI:
    def test_root(self, client):
        r = client.get("/")
        assert r.status_code == 200
        assert r.json()["name"] == "VAPTLearn"

    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200

    def test_list_commands(self, client):
        r = client.get("/api/commands")
        assert r.status_code == 200
        assert r.json()["total"] > 40

    def test_search_commands(self, client):
        r = client.get("/api/commands/search?q=nmap")
        assert r.status_code == 200
        assert r.json()["total"] >= 5

    def test_get_command(self, client):
        r = client.get("/api/commands/nmap-basic-scan")
        assert r.status_code == 200
        assert r.json()["tool"] == "nmap"

    def test_get_nonexistent_command(self, client):
        r = client.get("/api/commands/nonexistent")
        assert r.status_code == 404

    def test_list_phases(self, client):
        r = client.get("/api/phases")
        assert r.status_code == 200
        assert len(r.json()["phases"]) == 7

    def test_list_tools(self, client):
        r = client.get("/api/tools")
        assert r.status_code == 200
        assert r.json()["total"] > 15

    def test_list_mitre(self, client):
        r = client.get("/api/mitre/techniques")
        assert r.status_code == 200
        assert len(r.json()["techniques"]) >= 15

    def test_mitre_tactics(self, client):
        r = client.get("/api/mitre/tactics")
        assert r.status_code == 200
        assert len(r.json()["tactics"]) >= 3

    def test_categories(self, client):
        r = client.get("/api/commands/categories")
        assert r.status_code == 200
        assert "reconnaissance" in r.json()["categories"]

    def test_progress_mark(self, client):
        r = client.post("/api/progress/mark", json={"command_id": "nmap-basic-scan"})
        assert r.status_code == 200

    def test_progress_get(self, client):
        r = client.get("/api/progress")
        assert r.status_code == 200
        assert "total_commands" in r.json()
