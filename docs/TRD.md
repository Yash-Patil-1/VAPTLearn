# Technical Requirements Document (TRD)
## VAPTLearn — Penetration Testing Learning Platform

---

## 1. System Architecture

### 1.1 Architecture Pattern
**Full-Stack Web Application** — React frontend + FastAPI backend + JSON/SQLite data layer.
All components run locally on a single machine.

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + Vite + Tailwind v4)     │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ Command  │ │ Learning │ │  MITRE ATT&CK     │   │
│  │ Explorer │ │  Paths   │ │  Matrix View      │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────┐
│              Backend (FastAPI)                        │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ Command  │ │  Search  │ │  Progress         │   │
│  │ Service  │ │  Engine  │ │  Tracker          │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Data Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │  JSON    │ │  SQLite  │ │  Markdown         │   │
│  │Knowledge │ │ (progress│ │  (explanations)   │   │
│  │  Base    │ │  notes)  │ │                   │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| React 18 | UI Framework | 18.x |
| Vite 5 | Build tool | 5.x |
| Tailwind CSS v4 | Styling (Hyperstudio theme) | 4.x |
| React Router | Navigation | 6.x |
| Lucide React | Icons | Latest |
| react-syntax-highlighter | Code blocks | 15.x |
| Fuse.js | Client-side fuzzy search | 7.x |

### 2.2 Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| Python 3.10+ | Core language | 3.10+ |
| FastAPI | Web framework | 0.100+ |
| Uvicorn | ASGI server | 0.23+ |
| Pydantic | Data validation | 2.x |

### 2.3 Data Layer
| Technology | Purpose |
|-----------|---------|
| JSON files | Command knowledge base (200+ entries) |
| SQLite | User progress, bookmarks, notes |
| Markdown files | Long-form explanations, guides |

---

## 3. Design System (Hyperstudio — Monochrome Terminal + Amber)

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Midnight Void | `#101010` | Primary background |
| Deep Space | `#080808` | Secondary/deeper background |
| Dark Carbon | `#333333` | Borders, muted backgrounds |
| Ash Gray | `#949494` | Secondary text |
| Slate | `#C1C1C1` | Borders, dividers |
| Polar White | `#F3F3F3` | Primary text |
| Absolute Zero | `#FFFFFF` | Accent text, button text |
| Amber Glow | `#E7C59A` | Key accent (interactive, tags, highlights) |
| Neon Green | `#00AC5C` | Status indicators, success |

### Typography
| Role | Font | Weight | Sizes |
|------|------|--------|-------|
| Primary (all UI) | Inter (fallback for Aeonik) | 400, 700 | 13-63px |
| Code/Commands | JetBrains Mono (fallback for Input) | 400 | 13-18px |

### Spacing & Shape
| Token | Value |
|-------|-------|
| Base unit | 4px |
| Section gap | 64px |
| Card padding | 24px |
| Element gap | 10px |
| Button radius | 8px |
| Tag radius | 20px |
| Status icons | 99px (circle) |

### Design Rules
- NO drop shadows — use dark neutral shades for depth
- NO additional colors beyond Amber + Neon Green
- Tight line-heights for headlines
- 8px border radius for most elements
- Monospace font for all commands/code

---

## 4. API Specification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/commands` | List all commands (with filters) |
| GET | `/api/commands/{id}` | Get single command detail |
| GET | `/api/commands/search?q=` | Full-text search |
| GET | `/api/phases` | List all learning phases |
| GET | `/api/phases/{id}/commands` | Commands in a phase |
| GET | `/api/tools` | List all tools |
| GET | `/api/tools/{name}/commands` | Commands for a tool |
| GET | `/api/mitre/techniques` | List ATT&CK techniques |
| GET | `/api/mitre/{technique_id}` | Commands for a technique |
| GET | `/api/progress` | User progress data |
| POST | `/api/progress/mark` | Mark command as learned |
| GET | `/api/bookmarks` | User bookmarks |
| POST | `/api/bookmarks` | Add bookmark |
| DELETE | `/api/bookmarks/{id}` | Remove bookmark |
| GET | `/api/notes` | User notes |
| POST | `/api/notes` | Save note |

---

## 5. Knowledge Base Schema

### Command Entry (JSON)
```json
{
  "id": "nmap-sv-scan",
  "tool": "nmap",
  "category": "reconnaissance",
  "phase": 1,
  "os": ["linux", "windows"],
  "command": "nmap -sV -sC -p- <target>",
  "name": "Full Service Version Scan",
  "description": "Performs a comprehensive service version detection scan with default scripts on all ports.",
  "arguments": {
    "-sV": "Probe open ports to determine service/version info",
    "-sC": "Run default NSE scripts for additional enumeration",
    "-p-": "Scan all 65535 TCP ports"
  },
  "expected_output": "PORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 8.9\n80/tcp   open  http     Apache 2.4.52\n443/tcp  open  ssl/http nginx 1.18",
  "use_case": "Initial reconnaissance to identify all running services and their versions on a target host.",
  "prerequisites": ["Target IP/hostname", "Network connectivity", "Sufficient privileges for SYN scan"],
  "mitre_mapping": ["T1046"],
  "mitre_tactic": "Discovery",
  "detections": [
    "IDS/IPS alerts for port scanning activity",
    "Firewall logs showing sequential port connections",
    "Network flow analysis detecting scan patterns"
  ],
  "remediation": [
    "Implement network segmentation",
    "Configure host-based firewalls to limit exposed ports",
    "Use IDS rules to detect and alert on scanning activity",
    "Disable unnecessary services"
  ],
  "common_mistakes": [
    "Scanning without authorization",
    "Not using -Pn when host appears down",
    "Forgetting to scan UDP ports"
  ],
  "alternatives": ["masscan (faster)", "rustscan (faster)", "naabu (port discovery)"],
  "references": [
    "https://nmap.org/book/man-version-detection.html",
    "https://nmap.org/nsedoc/"
  ],
  "tags": ["scanning", "service-detection", "network", "tcp"]
}
```

---

## 6. Performance Requirements

| Metric | Requirement |
|--------|-------------|
| Initial page load | < 1.5 seconds |
| Search response | < 200ms |
| Command detail load | < 100ms |
| API response (p95) | < 50ms |
| Knowledge base size | < 5MB JSON |

---

## 7. Development Environment

### Prerequisites
- Python 3.10+
- Node.js 18+
- 4GB+ RAM

### Setup
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev  # port 5173
```

---

## 8. File Structure

```
VAPTLearn/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── commands.py
│   │   ├── phases.py
│   │   ├── tools.py
│   │   ├── mitre.py
│   │   └── progress.py
│   ├── services/
│   │   ├── search.py
│   │   └── knowledge_base.py
│   ├── models/
│   │   ├── database.py
│   │   └── schemas.py
│   └── data/
│       ├── commands/          # JSON files per category
│       │   ├── reconnaissance.json
│       │   ├── enumeration.json
│       │   ├── web_testing.json
│       │   ├── active_directory.json
│       │   ├── privilege_escalation.json
│       │   ├── exploitation.json
│       │   └── post_exploitation.json
│       ├── phases.json
│       ├── tools.json
│       └── mitre_techniques.json
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── styles/globals.css
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── public/
├── docs/
├── README.md
├── LICENSE
├── setup.sh
└── .gitignore
```
