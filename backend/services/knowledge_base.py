"""
Knowledge Base loader — reads all JSON command files and provides search/filter.
"""

import json
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent.parent / "data"


class KnowledgeBase:
    """Loads and indexes the command knowledge base from JSON files."""

    def __init__(self):
        self.commands: list[dict] = []
        self.phases: list[dict] = []
        self.tools: list[dict] = []
        self.mitre_techniques: list[dict] = []
        self.questions: list[dict] = []
        self.theory: list[dict] = []
        self._index: dict[str, dict] = {}  # id -> command

    def load(self):
        """Load all data from JSON files."""
        # Load commands from category files
        commands_dir = DATA_DIR / "commands"
        if commands_dir.exists():
            for f in sorted(commands_dir.glob("*.json")):
                with open(f, 'r') as fp:
                    entries = json.load(fp)
                    self.commands.extend(entries)

        # Build index
        self._index = {cmd["id"]: cmd for cmd in self.commands}

        # Load phases
        phases_file = DATA_DIR / "phases.json"
        if phases_file.exists():
            with open(phases_file, 'r') as f:
                self.phases = json.load(f)

        # Load tools
        tools_file = DATA_DIR / "tools.json"
        if tools_file.exists():
            with open(tools_file, 'r') as f:
                self.tools = json.load(f)

        # Load MITRE techniques
        mitre_file = DATA_DIR / "mitre_techniques.json"
        if mitre_file.exists():
            with open(mitre_file, 'r') as f:
                self.mitre_techniques = json.load(f)

        # Load quiz questions
        questions_dir = DATA_DIR / "questions"
        if questions_dir.exists():
            for f in sorted(questions_dir.glob("*.json")):
                with open(f, 'r') as fp:
                    self.questions.extend(json.load(fp))

        # Load theory
        theory_dir = DATA_DIR / "theory"
        if theory_dir.exists():
            for f in sorted(theory_dir.glob("*.json")):
                with open(f, 'r') as fp:
                    self.theory.append(json.load(fp))

    @property
    def command_count(self) -> int:
        return len(self.commands)

    @property
    def tool_count(self) -> int:
        return len(self.tools)

    def get_command(self, command_id: str) -> Optional[dict]:
        return self._index.get(command_id)

    def search_commands(self, query: str) -> list[dict]:
        """Simple text search across commands."""
        q = query.lower()
        results = []
        for cmd in self.commands:
            if (q in cmd["name"].lower() or
                q in cmd["tool"].lower() or
                q in cmd["description"].lower() or
                q in cmd["command"].lower() or
                any(q in tag for tag in cmd.get("tags", []))):
                results.append(cmd)
        return results

    def filter_commands(
        self,
        phase: Optional[int] = None,
        tool: Optional[str] = None,
        category: Optional[str] = None,
        os: Optional[str] = None,
        mitre: Optional[str] = None,
    ) -> list[dict]:
        """Filter commands by criteria."""
        results = self.commands
        if phase is not None:
            results = [c for c in results if c["phase"] == phase]
        if tool:
            results = [c for c in results if c["tool"].lower() == tool.lower()]
        if category:
            results = [c for c in results if c["category"].lower() == category.lower()]
        if os:
            results = [c for c in results if os.lower() in [o.lower() for o in c["os"]]]
        if mitre:
            results = [c for c in results if mitre.upper() in c.get("mitre_mapping", [])]
        return results

    def get_commands_by_phase(self, phase_id: int) -> list[dict]:
        return [c for c in self.commands if c["phase"] == phase_id]

    def get_commands_by_tool(self, tool_name: str) -> list[dict]:
        return [c for c in self.commands if c["tool"].lower() == tool_name.lower()]

    def get_commands_by_mitre(self, technique_id: str) -> list[dict]:
        return [c for c in self.commands if technique_id.upper() in c.get("mitre_mapping", [])]

    def get_categories(self) -> list[str]:
        return sorted(set(c["category"] for c in self.commands))

    def get_all_tags(self) -> list[str]:
        tags = set()
        for cmd in self.commands:
            tags.update(cmd.get("tags", []))
        return sorted(tags)
