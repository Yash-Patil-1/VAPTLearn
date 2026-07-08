"""
Guided lessons router — wraps knowledge_base theory + quiz_engine checkpoints.

Mapping: VAPTLearn theory files map by name to question topic_ids.
phase1_reconnaissance → reconnaissance
phase2_enumeration → enumeration
...
phase7_reporting → no pool (skips checkpoints)

# ponytail: a hardcoded dict is correct here — the content set is fixed and local, not user-generated.
"""

from fastapi import APIRouter, Request, HTTPException
from services.stats import award_xp, XP_LESSON_COMPLETE
from models.database import get_connection

router = APIRouter()

# Lesson ID → question topic_id(s) mapping
LESSON_QUESTION_TOPICS = {
    "phase1_reconnaissance": ["reconnaissance"],
    "phase2_enumeration": ["enumeration"],
    "phase3_vulnerability": ["vulnerability_assessment"],
    "phase4_exploitation": ["exploitation"],
    "phase5_privesc": ["privilege_escalation"],
    "phase6_postexploit": ["post_exploitation"],
    "phase7_reporting": [],
}

# Single source of truth for phase number → slug
PHASE_SLUGS = {
    1: "reconnaissance", 2: "enumeration", 3: "vulnerability",
    4: "exploitation", 5: "privesc", 6: "postexploit", 7: "reporting",
}

_PHASE_TO_LESSON = {}


def _lesson_id(phase_id: int) -> str:
    return f"phase{phase_id}_{PHASE_SLUGS.get(phase_id, str(phase_id))}"


def _build_index(kb):
    """Build a cached index of lesson_id → theory dict."""
    if _PHASE_TO_LESSON:
        return
    for theory in kb.theory:
        pid = theory.get("phase_id")
        lid = _lesson_id(pid)
        _PHASE_TO_LESSON[lid] = theory
        _PHASE_TO_LESSON[str(pid)] = theory


def _get_progress(conn):
    """Get set of learned lesson ids."""
    rows = conn.execute(
        "SELECT command_id FROM progress WHERE command_id LIKE 'lesson:%'"
    ).fetchall()
    return {r["command_id"].split(":", 1)[1] for r in rows}


@router.get("")
async def list_lessons(request: Request):
    """List all lessons (theory phases) with section count and learn status."""
    kb = request.app.state.kb
    engine = request.app.state.quiz_engine
    _build_index(kb)
    conn = get_connection()
    learned_set = _get_progress(conn)
    conn.close()

    lessons = []
    for theory in kb.theory:
        pid = theory.get("phase_id")
        lid = _lesson_id(pid)
        sections = theory.get("sections", [])
        topics = LESSON_QUESTION_TOPICS.get(lid, [])
        available_questions = 0
        for t in topics:
            available_questions += len(engine._by_topic.get(t, []))
        lessons.append({
            "id": lid,
            "title": theory.get("title", f"Phase {pid}"),
            "section_count": len(sections),
            "checkpoint_count": available_questions,
            "learned": lid in learned_set,
        })
    return {"lessons": lessons}


@router.get("/{lesson_id}")
async def get_lesson(request: Request, lesson_id: str):
    """Get lesson with ordered sections and checkpoint question IDs."""
    kb = request.app.state.kb
    _build_index(kb)
    theory = _PHASE_TO_LESSON.get(lesson_id)
    if not theory:
        raise HTTPException(404, "Lesson not found")

    sections = theory.get("sections", [])
    topics = LESSON_QUESTION_TOPICS.get(lesson_id, [])

    checkpoint_ids = []
    engine = request.app.state.quiz_engine
    for t in topics:
        for q in engine._by_topic.get(t, []):
            checkpoint_ids.append(q["id"])

    return {
        "id": lesson_id,
        "title": theory.get("title", ""),
        "sections": sections,
        "checkpoint_question_ids": checkpoint_ids,
    }


@router.post("/{lesson_id}/complete")
async def complete_lesson(request: Request, lesson_id: str):
    """Mark a lesson as learned and award XP."""
    kb = request.app.state.kb
    _build_index(kb)
    if lesson_id not in _PHASE_TO_LESSON:
        raise HTTPException(404, "Lesson not found")

    conn = get_connection()
    conn.execute(
        "INSERT OR IGNORE INTO progress (command_id) VALUES (?)",
        (f"lesson:{lesson_id}",),
    )
    conn.commit()
    conn.close()

    stats = award_xp(XP_LESSON_COMPLETE, "lesson")
    return {
        "status": "completed",
        "lesson_id": lesson_id,
        "xp_awarded": XP_LESSON_COMPLETE,
        "streak": stats,
    }
