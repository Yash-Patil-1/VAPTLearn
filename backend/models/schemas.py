"""Pydantic models."""

from pydantic import BaseModel
from typing import Optional


class ProgressMark(BaseModel):
    command_id: str


class BookmarkCreate(BaseModel):
    command_id: str


class NoteCreate(BaseModel):
    command_id: Optional[str] = None
    content: str
