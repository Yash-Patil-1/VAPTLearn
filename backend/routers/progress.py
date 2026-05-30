"""Progress, bookmarks, and notes endpoints."""

from fastapi import APIRouter, Request
from models.database import get_connection
from models.schemas import ProgressMark, BookmarkCreate, NoteCreate

router = APIRouter()


@router.get("")
async def get_progress(request: Request):
    """Get user progress stats."""
    kb = request.app.state.kb
    conn = get_connection()
    learned = conn.execute("SELECT COUNT(*) as count FROM progress").fetchone()["count"]
    conn.close()
    total = kb.command_count
    return {
        "total_commands": total,
        "learned": learned,
        "percentage": round((learned / total * 100) if total > 0 else 0, 1),
    }


@router.post("/mark")
async def mark_learned(body: ProgressMark):
    """Mark a command as learned."""
    conn = get_connection()
    conn.execute("INSERT OR IGNORE INTO progress (command_id) VALUES (?)", (body.command_id,))
    conn.commit()
    conn.close()
    return {"status": "marked", "command_id": body.command_id}


@router.delete("/mark/{command_id}")
async def unmark_learned(command_id: str):
    """Unmark a command."""
    conn = get_connection()
    conn.execute("DELETE FROM progress WHERE command_id = ?", (command_id,))
    conn.commit()
    conn.close()
    return {"status": "unmarked", "command_id": command_id}


@router.get("/bookmarks")
async def get_bookmarks():
    """Get all bookmarks."""
    conn = get_connection()
    rows = conn.execute("SELECT command_id, created_at FROM bookmarks ORDER BY created_at DESC").fetchall()
    conn.close()
    return {"bookmarks": [{"command_id": r["command_id"], "created_at": r["created_at"]} for r in rows]}


@router.post("/bookmarks")
async def add_bookmark(body: BookmarkCreate):
    conn = get_connection()
    conn.execute("INSERT OR IGNORE INTO bookmarks (command_id) VALUES (?)", (body.command_id,))
    conn.commit()
    conn.close()
    return {"status": "bookmarked", "command_id": body.command_id}


@router.delete("/bookmarks/{command_id}")
async def remove_bookmark(command_id: str):
    conn = get_connection()
    conn.execute("DELETE FROM bookmarks WHERE command_id = ?", (command_id,))
    conn.commit()
    conn.close()
    return {"status": "removed", "command_id": command_id}


@router.get("/notes")
async def get_notes():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM notes ORDER BY updated_at DESC").fetchall()
    conn.close()
    return {"notes": [dict(r) for r in rows]}


@router.post("/notes")
async def save_note(body: NoteCreate):
    conn = get_connection()
    conn.execute(
        "INSERT INTO notes (command_id, content) VALUES (?, ?)",
        (body.command_id, body.content)
    )
    conn.commit()
    conn.close()
    return {"status": "saved"}
