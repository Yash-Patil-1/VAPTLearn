"""MITRE ATT&CK endpoints."""

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/techniques")
async def list_techniques(request: Request):
    """List all MITRE ATT&CK techniques."""
    return {"techniques": request.app.state.kb.mitre_techniques}


@router.get("/techniques/{technique_id}")
async def get_technique(request: Request, technique_id: str):
    """Get technique detail with mapped commands."""
    kb = request.app.state.kb
    technique = next(
        (t for t in kb.mitre_techniques if t["id"].upper() == technique_id.upper()),
        None
    )
    if not technique:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Technique not found")
    commands = kb.get_commands_by_mitre(technique_id)
    return {"technique": technique, "commands": commands, "command_count": len(commands)}


@router.get("/tactics")
async def list_tactics(request: Request):
    """List all tactics with technique counts."""
    kb = request.app.state.kb
    tactics = {}
    for t in kb.mitre_techniques:
        tactic = t["tactic"]
        if tactic not in tactics:
            tactics[tactic] = {"name": tactic, "id": t["tactic_id"], "techniques": []}
        tactics[tactic]["techniques"].append({"id": t["id"], "name": t["name"]})
    return {"tactics": list(tactics.values())}
