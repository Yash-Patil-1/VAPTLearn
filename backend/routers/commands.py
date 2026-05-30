"""Command explorer endpoints."""

from fastapi import APIRouter, Request, Query
from typing import Optional

router = APIRouter()


@router.get("")
async def list_commands(
    request: Request,
    phase: Optional[int] = None,
    tool: Optional[str] = None,
    category: Optional[str] = None,
    os: Optional[str] = None,
    mitre: Optional[str] = None,
    limit: int = Query(default=50, le=500),
    offset: int = 0,
):
    """List commands with optional filters."""
    kb = request.app.state.kb
    results = kb.filter_commands(phase=phase, tool=tool, category=category, os=os, mitre=mitre)
    total = len(results)
    paginated = results[offset:offset + limit]
    return {"commands": paginated, "total": total, "limit": limit, "offset": offset}


@router.get("/search")
async def search_commands(request: Request, q: str = ""):
    """Full-text search across commands."""
    if not q or len(q) < 2:
        return {"commands": [], "total": 0, "query": q}
    kb = request.app.state.kb
    results = kb.search_commands(q)
    return {"commands": results[:50], "total": len(results), "query": q}


@router.get("/categories")
async def list_categories(request: Request):
    """List all command categories."""
    return {"categories": request.app.state.kb.get_categories()}


@router.get("/tags")
async def list_tags(request: Request):
    """List all tags."""
    return {"tags": request.app.state.kb.get_all_tags()}


@router.get("/{command_id}")
async def get_command(request: Request, command_id: str):
    """Get a single command by ID."""
    kb = request.app.state.kb
    cmd = kb.get_command(command_id)
    if not cmd:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Command not found")
    return cmd
