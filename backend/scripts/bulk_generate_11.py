#!/usr/bin/env python3
"""Batch 11 — push past 400."""
import json
from pathlib import Path
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "commands"

def e(id,tool,cat,phase,os,cmd,name,desc,args,output,use_case,prereqs,mitre,tactic,detections,remediation,mistakes,alts,refs,tags):
    return {"id":id,"tool":tool,"category":cat,"phase":phase,"os":os,"command":cmd,"name":name,"description":desc,"arguments":args,"expected_output":output,"use_case":use_case,"prerequisites":prereqs,"mitre_mapping":mitre,"mitre_tactic":tactic,"detections":detections,"remediation":remediation,"common_mistakes":mistakes,"alternatives":alts,"references":refs,"tags":tags}

L=["linux"];LW=["linux","windows"];LWM=["linux","windows","macos"];W=["windows"]

EXTRA=[
e("pspy-monitor","pspy","privilege_escalation",5,L,
"./pspy64",
"pspy Process Monitor","Monitors processes without root — reveals cron jobs and background tasks.",
{},"CMD: UID=0 PID=1234 | /bin/bash /opt/backup.sh\nCMD: UID=0 PID=1235 | /usr/bin/python3 /root/cleanup.py",
"Discover root cron jobs and processes without needing root access.",
["Transfer pspy to target"],["T1057"],"Discovery",
["New binary execution"],["N/A"],
["Binary blocked by AppArmor"],["ps aux","top"],
["https://github.com/DominicBreuker/pspy"],
["pspy","process","monitor","cron","no-root"]),
e("aquatone-screenshot","aquatone","reconnaissance",1,L,
"cat subdomains.txt | aquatone -ports 80,443,8080",
"Aquatone Web Screenshot","Takes screenshots of discovered web services — visual recon at scale.",
{"-ports":"Ports to check"},"[*] Processed 47 hosts\n[*] Screenshots saved to aquatone_report/\n[*] Report: aquatone_report.html",
"Visual reconnaissance — quickly identify interesting targets from large subdomain lists.",
["Subdomain list","aquatone installed"],["T1595"],"Reconnaissance",
["HTTP requests to many hosts"],["N/A"],
["Many hosts behind CDN"],["eyewitness","gowitness"],
["https://github.com/michenriksen/aquatone"],
["aquatone","screenshot","visual","recon","web"]),
e("seatbelt-enum","seatbelt","post_exploitation",6,W,
"Seatbelt.exe -group=all -full",
"Seatbelt (Windows Enumeration)","Comprehensive Windows security enumeration — checks credentials, configs, protections.",
{"-group=all":"Run all checks","-full":"Full output"},
"[*] Checking CredentialManager...\n[+] Saved credentials found: CORP\\admin\n[*] Checking AutoLogon...\n[+] DefaultPassword: Welcome1!",
"Post-exploitation Windows enumeration — finds credentials, misconfigs, and attack paths.",
["Shell on Windows"],["T1082"],"Discovery",
[".NET assembly execution","Enumeration activity"],["Remove stored credentials","Enable Credential Guard"],
["AV blocks Seatbelt"],["winPEAS","SharpUp","PowerUp"],
["https://github.com/GhostPack/Seatbelt"],
["seatbelt","enumeration","windows","credentials","post-exploitation"]),
e("sharphound-ingestor","sharphound","active_directory",2,W,
"SharpHound.exe -c All --stealth --outputdirectory C:\\temp\\",
"SharpHound Stealth Collection","Collects BloodHound data with stealth options — avoids detection.",
{"--stealth":"Stealth mode (slower, less noise)"},
"[+] Stealth mode: Using LDAP only\n[+] Collected 1500 users, 200 groups\n[+] Saved to C:\\temp\\bloodhound.zip",
"Stealthy AD data collection — uses only LDAP queries instead of noisy session enumeration.",
["Domain user","Domain-joined machine"],["T1087.002"],"Discovery",
["LDAP queries (less detectable in stealth)"],["Monitor LDAP query patterns"],
["Stealth mode misses session data"],["bloodhound-python","ADExplorer"],
["https://github.com/SpecterOps/BloodHound"],
["sharphound","stealth","bloodhound","collection","quiet"]),
e("crackmapexec-secrets","netexec","post_exploitation",6,L,
"netexec smb <target> -u admin -p pass --sam --lsa --ntds",
"NetExec Credential Dump","Dumps SAM, LSA secrets, and NTDS from target — all credentials at once.",
{"--sam":"Dump SAM","--lsa":"Dump LSA secrets","--ntds":"Dump NTDS (DC only)"},
"SAM:\nAdministrator:500:aad3b435...:fc525c96...\n\nLSA:\nDPAPI_SYSTEM: ...\n\nNTDS:\nkrbtgt:502:...",
"One-command credential dump — SAM for local, LSA for service accounts, NTDS for entire domain.",
["Admin credentials","SMB access"],["T1003"],"Credential Access",
["LSASS access","Registry access","Volume shadow copy"],
["Credential Guard","LSASS protection"],
["Credential Guard enabled"],["secretsdump.py","mimikatz"],
["https://github.com/Pennyw0rth/NetExec"],
["netexec","dump","sam","lsa","ntds","credentials"]),
e("subfinder-passive","subfinder","reconnaissance",1,L,
"subfinder -d <domain> -all -o subs.txt",
"Subfinder Passive Subdomain Discovery","Fast passive subdomain enumeration using multiple sources — completely silent.",
{"-all":"Use all sources","-o":"Output file"},
"[+] api.target.com\n[+] dev.target.com\n[+] staging.target.com\n[+] Found 89 subdomains",
"Fast passive subdomain discovery — uses certificate transparency, DNS databases, web archives.",
["Target domain"],["T1590.002"],"Reconnaissance",
["Cannot detect — passive only"],["Monitor certificate transparency"],
["Few passive sources configured"],["amass","crt.sh","SecurityTrails"],
["https://github.com/projectdiscovery/subfinder"],
["subfinder","passive","subdomain","fast","silent"]),
]

if __name__=="__main__":
    print("Batch 11 — final extras...")
    path = OUTPUT_DIR / "bulk11_extra.json"
    with open(path, 'w') as f:
        json.dump(EXTRA, f, indent=2)
    print(f"  Added: {len(EXTRA)}")
    total = 0
    for fp in OUTPUT_DIR.glob("*.json"):
        with open(fp) as f:
            total += len(json.load(f))
    print(f"\nTOTAL: {total}")
