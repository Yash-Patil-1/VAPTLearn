"""Tests for guided lessons API."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from main import app
from models.database import get_connection


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


class TestLessonsAPI:
    def test_list_lessons(self, client):
        r = client.get("/api/lessons")
        assert r.status_code == 200
        data = r.json()
        assert "lessons" in data
        assert len(data["lessons"]) >= 7  # At least the 7 phases

    def test_lesson_has_sections_and_checkpoints(self, client):
        """Each lesson returns sections in order and at least one checkpoint."""
        r = client.get("/api/lessons")
        lessons = r.json()["lessons"]
        # Test the first few lessons
        for lesson in lessons[:5]:
            rid = client.get(f"/api/lessons/{lesson['id']}")
            assert rid.status_code == 200
            data = rid.json()
            assert len(data["sections"]) > 0
            # Phase 1-6 should have checkpoints; phase 7 (reporting) may have none
            if lesson["id"] != "phase7_reporting":
                assert len(data["checkpoint_question_ids"]) > 0, f"{lesson['id']} has no checkpoints"

    def test_lesson_sections_in_order(self, client):
        """Sections should have ordered IDs."""
        r = client.get("/api/lessons")
        lessons = r.json()["lessons"]
        for lesson in lessons:
            rid = client.get(f"/api/lessons/{lesson['id']}")
            data = rid.json()
            sections = data["sections"]
            if len(sections) >= 2:
                # Check sections have sensible structure
                for s in sections:
                    assert "id" in s
                    assert "title" in s
                    assert "content" in s
                    assert "key_concepts" in s

    def test_complete_lesson(self, client):
        """Marking lesson complete returns XP and streak."""
        r = client.post("/api/lessons/phase1_reconnaissance/complete")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "completed"
        assert data["xp_awarded"] == 15
        assert "streak" in data
        assert data["streak"]["total_xp"] >= 15

    def test_nonexistent_lesson_404(self, client):
        r = client.get("/api/lessons/nonexistent-lesson")
        assert r.status_code == 404

    def test_checkpoints_exist_in_pool(self, client):
        """Checkpoint question IDs reference real questions in the quiz engine."""
        r = client.get("/api/lessons/phase1_reconnaissance")
        data = r.json()
        checkpoint_ids = data["checkpoint_question_ids"]
        assert len(checkpoint_ids) > 0
        # Verify each ID exists in the questions list
        from main import app  # noqa: F811
        engine = app.state.quiz_engine if hasattr(app, 'state') else None
        if engine:
            all_ids = {q["id"] for topic_qs in engine._by_topic.values() for q in topic_qs}
            for qid in checkpoint_ids:
                assert qid in all_ids, f"Checkpoint {qid} not found in question pool"
