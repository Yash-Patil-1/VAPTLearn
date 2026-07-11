"""
VAPTLearn — Penetration Testing Learning Platform
FastAPI Backend

Author: Yash Patil
Local-first. No cloud. No APIs. Educational only.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

from routers import commands, phases, tools, mitre, progress, quiz, lessons, streak, glossary
from models.database import init_db
from services.knowledge_base import KnowledgeBase
from services.quiz_engine import QuizEngine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load knowledge base on startup."""
    logger.info("Loading VAPTLearn knowledge base...")
    app.state.kb = KnowledgeBase()
    app.state.kb.load()
    logger.info("Loaded %d commands, %d tools", app.state.kb.command_count, app.state.kb.tool_count)
    app.state.quiz_engine = QuizEngine(app.state.kb.questions if hasattr(app.state.kb, 'questions') else [])
    await init_db()
    logger.info("Database initialized.")
    yield
    logger.info("Shutting down VAPTLearn.")


app = FastAPI(
    title="VAPTLearn",
    description="Penetration Testing Learning Platform — Educational VAPT methodology guide",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(commands.router, prefix="/api/commands", tags=["Commands"])
app.include_router(phases.router, prefix="/api/phases", tags=["Phases"])
app.include_router(tools.router, prefix="/api/tools", tags=["Tools"])
app.include_router(mitre.router, prefix="/api/mitre", tags=["MITRE ATT&CK"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["Lessons"])
app.include_router(streak.router, prefix="/api/streak", tags=["Streak"])
app.include_router(glossary.router, prefix="/api", tags=["Glossary"])


@app.get("/")
async def root():
    return {
        "name": "VAPTLearn",
        "version": "1.0.0",
        "description": "Penetration Testing Learning Platform",
        "author": "Yash Patil",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
