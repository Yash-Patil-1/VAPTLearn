"""Quiz router — command-type answers, scenario questions, low repetition."""
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from models.database import get_connection

router = APIRouter()


class AnswerSubmit(BaseModel):
    question_id: str
    category: str
    answer: str


@router.get("/next")
async def get_next_question(request: Request, category: str):
    """Get next quiz question for a category (respects repetition rules)."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT question_id FROM quiz_seen WHERE category = ? ORDER BY seen_at DESC",
        (category,)
    ).fetchall()
    seen_ids = [r["question_id"] for r in rows]
    conn.close()

    question = request.app.state.quiz_engine.get_next_question(category, seen_ids)
    if not question:
        raise HTTPException(404, "No questions available for this category")

    conn = get_connection()
    conn.execute("INSERT INTO quiz_seen (category, question_id) VALUES (?, ?)", (category, question["id"]))
    conn.commit()
    conn.close()

    return {
        "id": question["id"],
        "category": question.get("topic_id", category),
        "type": question["type"],
        "difficulty": question["difficulty"],
        "question": question["question"],
        "hints": question.get("hints", []),
    }


@router.post("/answer")
async def submit_answer(request: Request, body: AnswerSubmit):
    """Submit answer and get validation result."""
    questions = [q for q in request.app.state.kb.questions if q.get("topic_id") == body.category]
    question = next((q for q in questions if q["id"] == body.question_id), None)
    if not question:
        raise HTTPException(404, "Question not found")

    result = request.app.state.quiz_engine.validate_answer(question, body.answer)

    conn = get_connection()
    conn.execute(
        "INSERT INTO quiz_history (question_id, category, correct, user_answer) VALUES (?, ?, ?, ?)",
        (body.question_id, body.category, 1 if result["correct"] else 0, body.answer)
    )
    conn.commit()
    conn.close()
    return result


@router.get("/stats")
async def get_quiz_stats(request: Request, category: str = None):
    """Get quiz performance stats."""
    conn = get_connection()
    if category:
        total = conn.execute("SELECT COUNT(*) as c FROM quiz_history WHERE category = ?", (category,)).fetchone()["c"]
        correct = conn.execute("SELECT COUNT(*) as c FROM quiz_history WHERE category = ? AND correct = 1", (category,)).fetchone()["c"]
    else:
        total = conn.execute("SELECT COUNT(*) as c FROM quiz_history").fetchone()["c"]
        correct = conn.execute("SELECT COUNT(*) as c FROM quiz_history WHERE correct = 1").fetchone()["c"]
    conn.close()
    return {"total_answered": total, "correct": correct, "accuracy": round(correct / total * 100, 1) if total else 0}
