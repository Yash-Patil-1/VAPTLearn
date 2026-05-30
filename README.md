# 🔒 VAPTLearn — Penetration Testing Learning Platform

> **Learn VAPT methodology, commands, and techniques — with MITRE ATT&CK mapping, detection, and remediation.**

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![Tests](https://img.shields.io/badge/Tests-26%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

---

## What is this?

VAPTLearn is a local-first cybersecurity learning platform that teaches penetration testing through structured methodology. Like TryHackMe/HackTheBox Academy — but runs entirely on your machine, no labs needed.

**For each command, you get:**
- What it does and when to use it
- Arguments explained
- Expected output
- MITRE ATT&CK technique mapping
- How defenders detect it (Blue Team perspective)
- Remediation recommendations
- Common mistakes to avoid
- Alternative tools

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 Command Explorer | 402 commands with search & filter |
| 📖 Learning Paths | 7 theory chapters across PTES phases |
| 🛠️ Tool Library | 22 tools with installation guides |
| 🎯 MITRE ATT&CK | Techniques mapped to commands |
| 🛡️ Dual Perspective | Offense + Defense for every technique |
| 📊 Progress Tracking | Mark commands as learned |
| 🧠 Quiz Engine | 40 quiz questions to test knowledge |
| 🔖 Bookmarks & Notes | Personal reference system |
| 🌙 Hyperstudio Theme | Monochrome terminal + amber accents |

---

## 📊 Platform Stats

| Metric | Count |
|--------|-------|
| Commands | 402 |
| Categories | 10 |
| Tools | 22 |
| Theory Chapters | 7 |
| Quiz Questions | 40 |
| Automated Tests | 26 |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Yash-Patil-1/VAPTLearn.git
cd VAPTLearn

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1 — Backend
cd backend
./venv/bin/python -m uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.10+ |
| Database | SQLite (progress tracking) |
| Knowledge Base | JSON (commands, tools, theory) |
| Design | Hyperstudio — monochrome terminal + amber (#E7C59A) + green (#00AC5C) |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Platform info |
| GET | `/health` | Health check |
| GET | `/api/commands` | List all commands (with search/filter) |
| GET | `/api/commands/{id}` | Get command details |
| GET | `/api/phases` | List PTES phases |
| GET | `/api/tools` | List all tools |
| GET | `/api/mitre` | MITRE ATT&CK techniques |
| GET | `/api/mitre/tactics` | MITRE tactics |
| GET | `/api/quiz/questions` | Get quiz questions |
| POST | `/api/quiz/submit` | Submit quiz answers |
| POST | `/api/progress/mark` | Mark command as learned |
| GET | `/api/progress` | Get learning progress |

---

## 📁 Project Structure

```
VAPTLearn/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── data/
│   │   ├── commands/           # Command JSON files (402 commands)
│   │   ├── tools/              # Tool definitions (22 tools)
│   │   ├── phases/             # PTES phase data
│   │   ├── mitre/              # MITRE ATT&CK mappings
│   │   ├── theory/             # Learning chapters (7)
│   │   └── questions/          # Quiz questions (40)
│   ├── models/                 # Database models
│   ├── routers/                # API route handlers
│   ├── services/               # Business logic
│   └── tests/                  # Test suite (26 tests)
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page views
│   │   └── styles/             # Tailwind styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── database/               # SQLite database
├── docs/                       # Design documents
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🧪 Testing

```bash
cd backend
./venv/bin/python -m pytest tests/ -v
```

**26 tests passing** — knowledge base integrity, API endpoints, search, filters, progress tracking.

---

## 📖 Content Coverage

| Category | Description |
|----------|-------------|
| Reconnaissance | Network scanning, OSINT, subdomain enumeration |
| Enumeration | Service enumeration, SMB, SNMP, LDAP, DNS |
| Web Testing | Directory fuzzing, SQL injection, XSS, vulnerability scanning |
| Active Directory | BloodHound, Impacket, Kerberos attacks |
| Privilege Escalation | Linux/Windows privesc, kernel exploits |
| Exploitation | Metasploit, payload generation, exploit search |
| Post-Exploitation | Credential dumping, pivoting, persistence |
| Password Attacks | Hash cracking, brute force, wordlists |
| Wireless | WiFi attacks, WPA cracking |
| Reporting | Documentation, evidence collection |

---

## 🎨 Design

Hyperstudio design language:
- Dark monochrome terminal aesthetic
- Amber accent (#E7C59A) for highlights
- Green accent (#00AC5C) for success states
- Minimal, professional, distraction-free

---

## 🔒 Important

This is an **educational platform**. It does NOT:
- Execute attacks
- Provide vulnerable labs
- Automate exploitation
- Use external AI APIs
- Require cloud or VMs

It teaches methodology, explains commands, and builds understanding. Everything runs locally.

---

## 👤 Author

**Yash Patil** — B.Tech IT | CEH  
🌐 [yashpatil.online](https://www.yashpatil.online/) · 🐙 [GitHub](https://github.com/Yash-Patil-1) · 💼 [LinkedIn](https://www.linkedin.com/in/yash-patil-997357330/)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
