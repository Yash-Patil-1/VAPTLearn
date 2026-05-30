# Application Flow
## VAPTLearn — Penetration Testing Learning Platform

---

## 1. Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (fixed)                │  Main Content Area         │
│                                 │                            │
│  ┌───────────────────────────┐  │  ┌──────────────────────┐ │
│  │ 🔒 VAPTLearn              │  │  │  Page Content        │ │
│  │                           │  │  │  (varies by route)   │ │
│  │ 📊 Dashboard              │  │  │                      │ │
│  │ 📖 Learning Paths         │  │  │                      │ │
│  │ 🔍 Command Explorer       │  │  │                      │ │
│  │ 🛠️  Tool Library           │  │  │                      │ │
│  │ 🎯 MITRE ATT&CK          │  │  │                      │ │
│  │ 🔖 Bookmarks              │  │  │                      │ │
│  │ 📝 Notes                  │  │  │                      │ │
│  └───────────────────────────┘  │  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Page Flows

### Dashboard
- Progress overview (phases completed, commands learned)
- Quick stats cards
- Recent activity
- Recommended next command/phase
- Quick search bar

### Learning Paths
- 7 phases displayed as cards/timeline
- Each phase shows: title, description, command count, progress %
- Click phase → see all commands in that phase
- Sequential learning flow

### Command Explorer
- Full command list with search + filters
- Filters: Phase, Tool, OS, ATT&CK Technique, Category
- Each command card shows: name, tool, phase badge, MITRE badge
- Click → full command detail page

### Command Detail Page
```
┌─────────────────────────────────────────────────────┐
│  Command: nmap -sV -sC -p- <target>                 │
│  Tool: Nmap | Phase: Reconnaissance | OS: All       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📋 Description                                      │
│  What this command does and when to use it.          │
│                                                      │
│  ⚙️  Arguments                                       │
│  -sV → Service version detection                    │
│  -sC → Default scripts                             │
│  -p- → All ports                                   │
│                                                      │
│  📤 Expected Output                                  │
│  ┌─────────────────────────────────────────────┐    │
│  │ PORT   STATE SERVICE VERSION                 │    │
│  │ 22/tcp open  ssh     OpenSSH 8.9            │    │
│  │ 80/tcp open  http    Apache 2.4.52          │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  🎯 MITRE ATT&CK: T1046 (Network Service Discovery)│
│                                                      │
│  🛡️  Detection                                       │
│  • IDS alerts for port scanning                     │
│  • Firewall logs                                    │
│                                                      │
│  🔧 Remediation                                      │
│  • Network segmentation                             │
│  • Host-based firewalls                             │
│                                                      │
│  ⚠️  Common Mistakes                                 │
│  • Scanning without authorization                   │
│                                                      │
│  🔄 Alternatives: masscan, rustscan, naabu          │
│                                                      │
│  [📖 Mark as Learned] [🔖 Bookmark] [📝 Add Note]   │
└─────────────────────────────────────────────────────┘
```

### Tool Library
- Grid of tool cards (icon, name, category, command count)
- Click tool → see all commands for that tool
- Tool detail: description, installation, official docs link

### MITRE ATT&CK View
- Matrix-style view grouped by tactic
- Click technique → see all mapped commands
- Technique detail: description, commands, detection, examples

### Bookmarks
- List of bookmarked commands
- Quick access to favorites
- Remove bookmark

### Notes
- Personal notes attached to commands
- Markdown editor
- Export as .md file

---

## 3. Search Flow

```
User types in search bar
    │
    ▼
Fuse.js fuzzy search across:
  - Command names
  - Tool names
  - Descriptions
  - Tags
  - MITRE technique IDs
    │
    ▼
Results displayed instantly (< 200ms)
  - Grouped by category
  - Highlighted matches
  - Click to navigate
```

---

## 4. Data Flow

```
JSON Knowledge Base (static files)
    │
    ▼
FastAPI loads on startup → serves via REST
    │
    ▼
React fetches → renders with syntax highlighting
    │
    ▼
User interactions (bookmark, note, progress)
    │
    ▼
SQLite stores user state locally
```
