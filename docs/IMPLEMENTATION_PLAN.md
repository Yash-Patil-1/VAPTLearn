# Implementation Plan
## VAPTLearn — Penetration Testing Learning Platform

---

## Timeline: 3-4 weeks

```
Week 1: Knowledge Base + Backend API
Week 2: Frontend (Dashboard, Explorer, Detail pages)
Week 3: MITRE view, Search, Progress tracking, Polish
Week 4: Content expansion, Testing, Documentation
```

---

## Phase 1: Setup + Knowledge Base (Day 1-4)

| Task | Priority |
|------|----------|
| Project structure (backend/frontend/data) | P0 |
| Create command JSON schema | P0 |
| Write 30+ reconnaissance commands | P0 |
| Write 20+ enumeration commands | P0 |
| Write 20+ web testing commands | P0 |
| Write 15+ AD commands | P0 |
| Write 15+ privilege escalation commands | P0 |
| Create phases.json | P0 |
| Create tools.json | P0 |
| Create mitre_techniques.json | P0 |

**Deliverable:** 100+ commands in JSON knowledge base

---

## Phase 2: Backend API (Day 5-7)

| Task | Priority |
|------|----------|
| FastAPI app structure | P0 |
| Commands router (list, detail, search, filter) | P0 |
| Phases router | P0 |
| Tools router | P0 |
| MITRE router | P0 |
| Progress router (mark learned, get stats) | P1 |
| Bookmarks router | P1 |
| Notes router | P1 |
| SQLite setup for user state | P0 |
| CORS configuration | P0 |

**Deliverable:** Working REST API with all endpoints

---

## Phase 3: Frontend Core (Day 8-13)

| Task | Priority |
|------|----------|
| Vite + React + Tailwind v4 setup | P0 |
| Hyperstudio theme (globals.css) | P0 |
| Sidebar navigation | P0 |
| Dashboard page | P0 |
| Command Explorer (list + filters) | P0 |
| Command Detail page | P0 |
| Learning Paths page | P0 |
| Tool Library page | P1 |
| Code syntax highlighting | P0 |
| Copy-to-clipboard | P0 |
| Search (Fuse.js) | P0 |

**Deliverable:** Functional frontend with all core pages

---

## Phase 4: Advanced Features (Day 14-17)

| Task | Priority |
|------|----------|
| MITRE ATT&CK matrix view | P1 |
| Progress tracking UI | P1 |
| Bookmarks page | P1 |
| Notes editor (Markdown) | P1 |
| Filter by OS (Windows/Linux) | P0 |
| Responsive design | P1 |
| Loading states | P1 |

**Deliverable:** Full-featured application

---

## Phase 5: Content + Polish (Day 18-22)

| Task | Priority |
|------|----------|
| Expand to 200+ commands | P0 |
| Add exploitation commands | P0 |
| Add post-exploitation commands | P0 |
| Add reporting templates | P1 |
| Write tests | P0 |
| Performance optimization | P1 |
| README + setup.sh | P0 |
| LICENSE | P0 |

**Deliverable:** GitHub-ready project with 200+ commands

---

## Content Categories (Target: 400+ commands)

| Category | Target Count | Tools |
|----------|-------------|-------|
| Reconnaissance | 55 | Nmap, Amass, Subfinder, theHarvester, Shodan, Censys, WHOIS, DNSrecon, Masscan |
| Enumeration | 50 | Nmap NSE, enum4linux, SMBclient, SNMP, LDAP, NFS, RPC |
| Web Testing | 60 | Burp Suite, ffuf, Gobuster, SQLMap, Nuclei, XSStrike, Nikto, Feroxbuster, Commix, WPScan |
| API Testing | 25 | Postman, Kiterunner, Arjun, JWT attacks |
| Active Directory | 50 | BloodHound, Impacket, NetExec, Responder, Kerbrute, Rubeus, Certipy, SharpHound |
| Windows PrivEsc | 35 | PEASS-ng, Seatbelt, SharpUp, PowerSploit, LOLBAS |
| Linux PrivEsc | 35 | PEASS-ng, LinEnum, GTFOBins, pspy, linux-exploit-suggester |
| Exploitation | 30 | Metasploit, msfvenom, searchsploit, BeEF |
| Post-Exploitation | 30 | Mimikatz, LaZagne, Chisel, Ligolo, Rubeus, Covenant |
| Password Attacks | 20 | Hashcat, John, Hydra, CeWL, Responder |
| Wireless | 15 | Aircrack-ng, Wifite, Bettercap |
| Cloud/Container | 15 | ScoutSuite, Prowler, kube-bench, trivy |
| **Total** | **420+** | **70+ tools** |
