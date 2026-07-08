"""Streak & XP router."""

from fastapi import APIRouter
from services.stats import get_streak

router = APIRouter()


@router.get("")
async def streak():
    """Get current streak, XP, and last 7 days of activity."""
    return get_streak()
