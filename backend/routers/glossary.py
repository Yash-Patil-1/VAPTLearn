"""Glossary router — serves the VAPT terminology dictionary."""

from fastapi import APIRouter, Request

router = APIRouter(tags=["Glossary"])


@router.get("/glossary")
async def list_glossary(request: Request):
    """Return all glossary terms."""
    terms = getattr(request.app.state.kb, "glossary", [])
    return {"count": len(terms), "terms": terms}


@router.get("/glossary/search")
async def search_glossary(request: Request, q: str = ""):
    """Search glossary terms by term name or definition."""
    terms = getattr(request.app.state.kb, "glossary", [])
    if not q:
        return {"count": len(terms), "terms": terms}
    ql = q.lower()
    results = [
        t for t in terms
        if ql in t["term"].lower() or ql in t["definition"].lower()
    ]
    return {"count": len(results), "terms": results}


@router.get("/glossary/count")
async def glossary_count(request: Request):
    """Return total glossary count."""
    terms = getattr(request.app.state.kb, "glossary", [])
    return {"count": len(terms)}
