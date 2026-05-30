"""Learning phases endpoints."""

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("")
async def list_phases(request: Request):
    """List all learning phases."""
    kb = request.app.state.kb
    # Enrich with actual command counts
    phases = []
    for phase in kb.phases:
        p = dict(phase)
        p["command_count"] = len(kb.get_commands_by_phase(phase["id"]))
        phases.append(p)
    return {"phases": phases}


@router.get("/{phase_id}")
async def get_phase(request: Request, phase_id: int):
    """Get phase detail with its commands."""
    kb = request.app.state.kb
    phase = next((p for p in kb.phases if p["id"] == phase_id), None)
    if not phase:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Phase not found")
    commands = kb.get_commands_by_phase(phase_id)
    return {"phase": phase, "commands": commands, "command_count": len(commands)}
