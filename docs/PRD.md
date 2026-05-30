# Product Requirements Document (PRD)
## VAPTLearn — Penetration Testing Learning Platform

---

## 1. Product Overview

**Product Name:** VAPTLearn  
**Version:** 1.0  
**Author:** Yash Patil  
**Date:** 2026-05-30  

### 1.1 Vision Statement
VAPTLearn is a local-first cybersecurity learning platform that teaches penetration testing methodology, commands, tools, attack chains, and security concepts. Inspired by TryHackMe, Hack The Box Academy, PortSwigger, and HackTricks — but runs entirely on your machine with no labs, no VMs, no cloud.

The platform acts as an **intelligent guide** while you perform real testing against your own infrastructure. It explains the "why" behind every command, maps to MITRE ATT&CK, shows detection opportunities, and teaches defensive thinking alongside offensive techniques.

### 1.2 Problem Statement
- Cybersecurity learners struggle to understand the methodology behind pentesting
- Existing platforms (THM, HTB) require internet, subscriptions, and pre-built labs
- Most cheat sheets lack context — they show commands without explaining why/when/how
- No single platform combines PTES methodology + MITRE mapping + detection + remediation
- Learners need a structured path from reconnaissance to reporting

### 1.3 Target Users
| User Type | Description |
|-----------|-------------|
| CEH/OSCP Students | Preparing for certifications |
| Pentest Beginners | Learning methodology from scratch |
| Security Professionals | Quick reference during engagements |
| Portfolio Viewers | Hiring managers evaluating Yash's security expertise |

### 1.4 What This Is NOT
- NOT a vulnerable lab environment (user provides their own targets)
- NOT an automated attack tool
- NOT a replacement for hands-on practice
- It IS an educational reference + methodology guide

---

## 2. Goals & Success Metrics

### 2.1 Primary Goals
1. Teach VAPT methodology in a structured, phase-by-phase approach
2. Provide deep command explanations with MITRE ATT&CK mapping
3. Show both offensive AND defensive perspectives for every technique
4. Create a searchable, filterable knowledge base of 200+ commands
5. Build a visually impressive portfolio piece

### 2.2 Success Metrics
| Metric | Target |
|--------|--------|
| Commands in knowledge base | 400+ |
| MITRE ATT&CK techniques mapped | 80+ |
| Learning phases covered | 7 (full PTES) |
| Tools documented | 70+ |
| Page load time | < 1 second |

---

## 3. Features & Requirements

### 3.1 Core Features

#### F1: Command Knowledge Base
- 200+ commands stored as structured JSON
- Each command includes: description, arguments, expected output, MITRE mapping, detections, remediation
- Searchable by keyword, tool, phase, technique, OS
- Syntax-highlighted command examples
- Copy-to-clipboard functionality

#### F2: Learning Paths (PTES Phases)
- 7 structured phases following PTES methodology
- Phase 1: Pre-engagement & Reconnaissance
- Phase 2: Enumeration & Scanning
- Phase 3: Vulnerability Assessment
- Phase 4: Exploitation (Theory & Methodology)
- Phase 5: Post-Exploitation & Privilege Escalation
- Phase 6: Lateral Movement & Persistence
- Phase 7: Reporting & Documentation
- Progress tracking per phase

#### F3: MITRE ATT&CK Integration
- Every command mapped to ATT&CK techniques
- Technique explorer with tactic grouping
- Visual ATT&CK matrix view
- Filter commands by technique ID

#### F4: Dual Perspective (Offense + Defense)
- For each technique, show:
  - How attackers use it (offensive)
  - How defenders detect it (defensive)
  - Remediation recommendations
  - Log sources for detection
  - SIEM rules / detection logic

#### F5: Tool Explorer
- Categorized tool library (50+ tools)
- Tool descriptions, installation, common usage
- Categories: Recon, Scanning, Web, AD, PrivEsc, Exploitation, Post-Ex
- Links to official documentation

#### F6: Search & Filter Engine
- Full-text search across all commands
- Filter by: phase, tool, OS (Windows/Linux), ATT&CK technique, category
- Tag-based navigation
- Recently viewed / bookmarked commands

#### F7: Notes & Bookmarks
- Personal notes per command/technique
- Bookmark favorite commands
- Export notes as Markdown

#### F8: Interactive Dashboard
- Overview of all phases with progress
- Quick stats (commands learned, techniques covered)
- Recent activity
- Recommended next steps

### 3.2 Nice-to-Have (v2)
- Attack chain visualization (graph view)
- Quiz/assessment mode
- Custom command additions by user
- Report template generator
- Cheat sheet PDF export

---

## 4. Constraints

| Constraint | Details |
|-----------|---------|
| No Docker | Runs directly on local machine |
| No Cloud | No AWS/GCP/Azure |
| No VMs | No vulnerable lab environments |
| No APIs | All data is local JSON/SQLite |
| Local-first | Works completely offline after setup |
| Educational | Does NOT execute attacks |
| Performance | Must run on 4GB+ RAM machine |

---

## 5. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|-------------|-----------|
| US1 | Learner | Browse commands by phase | I follow a structured methodology |
| US2 | Learner | Search for a specific tool | I quickly find usage examples |
| US3 | Learner | See MITRE mapping for a command | I understand the attack context |
| US4 | Learner | See detection methods | I learn both offense and defense |
| US5 | Learner | Track my progress | I know what I've covered |
| US6 | Learner | Bookmark commands | I build my personal reference |
| US7 | Learner | Filter by OS | I find relevant commands for my target |
| US8 | Professional | Quick-search during engagement | I get syntax reminders fast |

---

## 6. Content Scope (v1)

### Tools to Document (50+)
**Reconnaissance:** Nmap, Amass, Subfinder, theHarvester, Shodan, Censys, WHOIS
**Web Testing:** Burp Suite, ffuf, Gobuster, Nikto, SQLMap, XSStrike, Nuclei
**Active Directory:** BloodHound, Impacket, NetExec, Responder, Kerbrute, Rubeus, Certipy
**Privilege Escalation:** PEASS-ng, LinEnum, GTFOBins, LOLBAS, PowerSploit
**Exploitation:** Metasploit, msfvenom, searchsploit
**Password:** Hashcat, John the Ripper, Hydra
**Post-Exploitation:** Mimikatz, LaZagne, Chisel, Ligolo
**Wireless:** Aircrack-ng, Wifite
**Reporting:** Custom templates

### MITRE ATT&CK Techniques (50+)
Reconnaissance (TA0043), Initial Access (TA0001), Execution (TA0002), Persistence (TA0003), Privilege Escalation (TA0004), Defense Evasion (TA0005), Credential Access (TA0006), Discovery (TA0007), Lateral Movement (TA0008), Collection (TA0009), Exfiltration (TA0010), Impact (TA0011)

---

## 7. Out of Scope (v1)
- Vulnerable lab environments
- Automated scanning/exploitation
- Real-time attack execution
- User authentication/accounts
- Cloud deployment
- Mobile app
