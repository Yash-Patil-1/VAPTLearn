"""Pydantic models."""

from pydantic import BaseModel
from typing import Optional


class CommandEntry(BaseModel):
    id: str
    tool: str
    category: str
    phase: int
    os: list[str]
    command: str
    name: str
    description: str
    arguments: dict[str, str]
    expected_output: str
    use_case: str
    prerequisites: list[str]
    mitre_mapping: list[str]
    mitre_tactic: str
    detections: list[str]
    remediation: list[str]
    common_mistakes: list[str]
    alternatives: list[str]
    references: list[str]
    tags: list[str]


class Phase(BaseModel):
    id: int
    name: str
    description: str
    methodology: str
    objectives: list[str]
    tools: list[str]
    command_count: int


class Tool(BaseModel):
    id: str
    name: str
    category: str
    description: str
    installation: str
    official_url: str
    platforms: list[str]
    command_count: int


class MitreTechnique(BaseModel):
    id: str
    name: str
    tactic: str
    tactic_id: str
    description: str
    detection: str
    platforms: list[str]
    url: str


class ProgressMark(BaseModel):
    command_id: str


class BookmarkCreate(BaseModel):
    command_id: str


class NoteCreate(BaseModel):
    command_id: Optional[str] = None
    content: str
