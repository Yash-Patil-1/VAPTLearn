# Backend Schema
## VAPTLearn — Penetration Testing Learning Platform

---

## 1. Data Architecture

The knowledge base is stored as **static JSON files** (fast, no database needed for content).
User state (progress, bookmarks, notes) is stored in **SQLite**.

---

## 2. Knowledge Base (JSON)

### commands/{category}.json
Each category file contains an array of command objects:

```json
[
  {
    "id": "nmap-sv-scan",
    "tool": "nmap",
    "category": "reconnaissance",
    "phase": 1,
    "os": ["linux", "windows"],
    "command": "nmap -sV -sC -p- <target>",
    "name": "Full Service Version Scan",
    "description": "...",
    "arguments": { "-sV": "...", "-sC": "...", "-p-": "..." },
    "expected_output": "...",
    "use_case": "...",
    "prerequisites": ["..."],
    "mitre_mapping": ["T1046"],
    "mitre_tactic": "Discovery",
    "detections": ["..."],
    "remediation": ["..."],
    "common_mistakes": ["..."],
    "alternatives": ["..."],
    "references": ["..."],
    "tags": ["scanning", "network"]
  }
]
```

### phases.json
```json
[
  {
    "id": 1,
    "name": "Reconnaissance",
    "description": "Information gathering about the target",
    "methodology": "PTES Phase 2 - Intelligence Gathering",
    "objectives": ["Identify target scope", "Discover subdomains", "Map network"],
    "tools": ["nmap", "amass", "subfinder", "theHarvester"],
    "command_count": 30
  }
]
```

### tools.json
```json
[
  {
    "id": "nmap",
    "name": "Nmap",
    "category": "reconnaissance",
    "description": "Network exploration and security auditing tool",
    "installation": "sudo apt install nmap",
    "official_url": "https://nmap.org",
    "documentation": "https://nmap.org/book",
    "platforms": ["linux", "windows", "macos"],
    "command_count": 15
  }
]
```

### mitre_techniques.json
```json
[
  {
    "id": "T1046",
    "name": "Network Service Discovery",
    "tactic": "Discovery",
    "tactic_id": "TA0007",
    "description": "Adversaries may attempt to get a listing of services running on remote hosts.",
    "detection": "Monitor for unusual network scanning activity",
    "platforms": ["Windows", "Linux", "macOS"],
    "data_sources": ["Network Traffic", "Process Monitoring"],
    "url": "https://attack.mitre.org/techniques/T1046/"
  }
]
```

---

## 3. SQLite Schema (User State)

```sql
CREATE TABLE progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command_id TEXT NOT NULL UNIQUE,
    learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command_id TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Pydantic Models

```python
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
```

---

## 5. API Response Examples

### GET /api/commands?phase=1&tool=nmap
```json
{
  "commands": [...],
  "total": 15,
  "filters": { "phase": 1, "tool": "nmap" }
}
```

### GET /api/progress
```json
{
  "total_commands": 200,
  "learned": 45,
  "percentage": 22.5,
  "by_phase": { "1": 12, "2": 8, "3": 10, "4": 5, "5": 6, "6": 2, "7": 2 }
}
```
