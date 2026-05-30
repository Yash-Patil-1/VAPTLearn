"""Tool library endpoints."""

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("")
async def list_tools(request: Request):
    """List all tools."""
    kb = request.app.state.kb
    tools = []
    for tool in kb.tools:
        t = dict(tool)
        t["command_count"] = len(kb.get_commands_by_tool(tool["id"]))
        tools.append(t)
    return {"tools": tools, "total": len(tools)}


@router.get("/{tool_name}")
async def get_tool(request: Request, tool_name: str):
    """Get tool detail with its commands."""
    kb = request.app.state.kb
    tool = next((t for t in kb.tools if t["id"].lower() == tool_name.lower()), None)
    if not tool:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Tool not found")
    commands = kb.get_commands_by_tool(tool_name)
    return {"tool": tool, "commands": commands, "command_count": len(commands)}
