import type { Module, Exam, SubTopic } from './types';

const CEH_MODULES: Module[] = [
    {
        id: 1,
        title: "Introduction to Ethical Hacking",
        icon: 'shield',
        color: "bg-gray-100 text-gray-600",
        subTopics: ["Information security overview", "Cyber kill chain", "MITRE ATT&CK framework", "Hacker types", "Attack vectors", "Penetration testing concepts", "Vulnerability, threat, and risk", "Security policies", "Incident management", "OWASP", "CIA triad", "Defense-in-depth"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 2,
        title: "Footprinting & Reconnaissance",
        icon: 'footprint',
        color: "bg-slate-100 text-slate-600",
        subTopics: ["Passive footprinting", "Active footprinting", "WHOIS lookup", "DNS enumeration", "Email harvesting", "Website footprinting", "Social networks reconnaissance", "Google dorking", "Shodan OSINT", "People search", "Metadata extraction", "Footprinting through job sites", "Network footprinting", "Vulnerability footprinting"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 3,
        title: "Scanning Networks",
        icon: 'scan',
        color: "bg-red-100 text-red-600",
        subTopics: ["Host discovery", "Port scanning", "Service/version detection", "Nmap advanced scanning", "TCP/UDP scanning", "Idle scan", "Vulnerability scanning", "Banner grabbing", "Firewalking", "Proxy scanning", "Network mapping", "OS detection"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 4,
        title: "Enumeration",
        icon: 'users',
        color: "bg-orange-100 text-orange-600",
        subTopics: ["NetBIOS enumeration", "SNMP enumeration", "LDAP enumeration", "NFS, RPC enumeration", "DNS zone transfers", "SMB enumeration", "SMTP user enumeration", "FTP enumeration", "Active Directory enumeration", "Vulnerability identification using enumeration"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 5,
        title: "Vulnerability Analysis",
        icon: 'bug',
        color: "bg-amber-100 text-amber-600",
        subTopics: ["Vulnerability lifecycle", "Vulnerability scoring (CVSS)", "SIEM & scanning tools", "Automating scans", "Network vulnerability scanning", "Application vulnerability scanning", "Database vulnerability scanning", "Host-based vulnerability assessment", "Patch management"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 6,
        title: "System Hacking",
        icon: 'laptop',
        color: "bg-yellow-100 text-yellow-600",
        subTopics: ["Password cracking", "Privilege escalation (Windows & Linux)", "Malware service manipulation", "UAC bypass", "Executing applications remotely", "Hiding files & folders", "Clearing logs", "Covering tracks", "Persistence techniques", "Credential dumping (LSA, SAM)", "Mimikatz"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 7,
        title: "Malware Threats",
        icon: 'alert',
        color: "bg-lime-100 text-lime-600",
        subTopics: ["Trojan analysis", "Backdoor analysis", "Virus types", "Worms", "Botnet architecture", "Keyloggers", "Ransomware basics", "Malware lifecycle", "AMSI bypass basics", "Malware obfuscation", "Malware detection tools"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 8,
        title: "Sniffing",
        icon: 'wifi',
        color: "bg-green-100 text-green-600",
        subTopics: ["Packet sniffing basics", "Wireshark analysis", "MAC flooding", "DHCP starvation", "ARP poisoning", "MITM attacks", "DNS spoofing", "SSL strip", "Sniffing in switched networks", "Sniffing countermeasures"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 9,
        title: "Social Engineering",
        icon: 'users',
        color: "bg-emerald-100 text-emerald-600",
        subTopics: ["Human-based attacks", "Phishing, smishing, vishing", "Impersonation attacks", "Baiting & quid pro quo", "Social engineering frameworks", "Honeypots for social engineering prevention", "Insider attacks", "Awareness training"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 10,
        title: "Denial of Service",
        icon: 'ban',
        color: "bg-teal-100 text-teal-600",
        subTopics: ["DoS techniques", "DDoS botnets", "Application layer DDoS", "SYN flood attacks", "UDP flood attacks", "HTTP flood", "Slowloris attack", "Botnets architecture", "DoS detection", "Mitigation (CDNs, WAFs)"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 11,
        title: "Session Hijacking",
        icon: 'key',
        color: "bg-cyan-100 text-cyan-600",
        subTopics: ["Session hijacking basics", "Session prediction", "TCP hijacking", "UDP hijacking", "Application-level hijacking", "Cookie stealing", "Cross-site request forgery token bypass", "Session sniffing", "Countermeasures"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 12,
        title: "Evading IDS, Firewalls & Honeypots",
        icon: 'shield-check',
        color: "bg-sky-100 text-sky-600",
        subTopics: ["IDS detection techniques", "Firewall rules bypassing", "Honeypot detection & evasion", "Traffic fragmentation", "Stealth scanning", "Packet crafting tools", "Polymorphic shellcode", "Tunneling techniques (DNS, ICMP, HTTP)", "Proxy evasion"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 13,
        title: "Hacking Web Servers",
        icon: 'server',
        color: "bg-blue-100 text-blue-600",
        subTopics: ["Web server fingerprinting", "IIS & Apache vulnerabilities", "Misconfiguration attacks", "Directory traversal", "Web server malware", "SSH brute-force", "Uploading shells", "Web server hardening"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 14,
        title: "Hacking Web Applications",
        icon: 'code-bracket',
        color: "bg-indigo-100 text-indigo-600",
        subTopics: ["OWASP Top 10", "SQL Injection", "XSS (reflected, stored, DOM)", "CSRF attacks", "Command injection", "File inclusion", "Broken authentication", "API hacking", "Web app reconnaissance", "Cookie manipulation", "Web shell exploitation"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 15,
        title: "SQL Injection",
        icon: 'database',
        color: "bg-violet-100 text-violet-600",
        subTopics: ["SQLi basics", "UNION-based SQLi", "Error-based SQLi", "Boolean/blind SQLi", "Time-based SQLi", "Out-of-band SQLi", "Bypassing WAF", "Extracting database data", "Targeting MySQL, MSSQL, Oracle, PostgreSQL"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 16,
        title: "Hacking Wireless Networks",
        icon: 'wifi',
        color: "bg-purple-100 text-purple-600",
        subTopics: ["Wi-Fi basics", "WEP/WPA/WPA2 cracking", "Evil twin attacks", "Rogue AP", "Deauthentication attack", "Wi-Fi phishing", "Bluetooth hacking", "NFC attacks", "Wireless security hardening"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 17,
        title: "Hacking Mobile Platforms",
        icon: 'smartphone',
        color: "bg-fuchsia-100 text-fuchsia-600",
        subTopics: ["Android architecture", "iOS architecture", "Mobile malware", "Mobile app pentesting", "Rooting & jailbreak basics", "Mobile device management", "Mobile OS vulnerabilities", "App reverse engineering"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 18,
        title: "IoT & OT Hacking",
        icon: 'iot',
        color: "bg-pink-100 text-pink-600",
        subTopics: ["IoT device architecture", "IoT attack surface", "Smart home hacking", "Embedded device exploitation", "SCADA/ICS basics", "Modbus attacks", "RTU & PLC attacks", "IoT malware (Mirai, others)", "IoT security controls"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 19,
        title: "Cloud Computing",
        icon: 'cloud',
        color: "bg-rose-100 text-rose-600",
        subTopics: ["Cloud security basics", "Shared responsibility model", "IAM in cloud", "Cloud attacks", "Serverless exploitation", "Container security", "Cloud network security", "Cloud enum (AWS/Azure/GCP)", "Cloud hardening techniques"].map(t => ({ title: t, content: [] }))
    },
    {
        id: 20,
        title: "Cryptography",
        icon: 'lock',
        color: "bg-stone-100 text-stone-600",
        subTopics: ["Encryption types", "Hashing algorithms", "Digital signatures", "SSL/TLS", "Steganography", "Kerberos", "Disk encryption", "Email encryption", "Cryptanalysis techniques"].map(t => ({ title: t, content: [] }))
    }
];

const CISSP_MODULES: Module[] = [
    {
        id: 21,
        title: "DOMAIN 1: Security & Risk Management",
        icon: 'shield',
        color: "bg-gray-100 text-gray-600",
        subTopics: [
          { title: "1.1 Security Fundamentals", content: ["CIA Triad", "Due care / Due diligence", "Security governance", "Security roles & responsibilities", "Threat modeling", "Information security management"] },
          { title: "1.2 Security Governance Principles", content: ["Policies, standards, procedures, guidelines", "Security frameworks (ISO 27001, NIST CSF, NIST 800-53)", "Governance vs Management", "Control types (Administrative/Technical/Physical)", "Control functions (Preventive, Detective, Corrective)"] },
          { title: "1.3 Compliance", content: ["Legal systems: Civil, Common, Religious, Customary", "Cyber laws:", "Privacy laws (GDPR, HIPAA, CCPA)", "Intellectual Property laws", "Computer Crime laws", "Contracting & procurement", "Licensing agreements:", "Open-source", "Proprietary", "Creative Commons"] },
          { title: "1.4 Risk Management", content: ["Risk identification", "Risk analysis:", "Qualitative", "Quantitative (ALE, SLE, ARO)", "Risk treatment:", "Accept", "Avoid", "Transfer", "Mitigate", "Risk registers", "Threat modeling (STRIDE, DREAD, PASTA)"] },
          { title: "1.5 Business Continuity (BC)", content: ["Business Impact Analysis (BIA)", "MTD, RTO, RPO, WRT", "Continuity planning", "Alternate sites:", "Hot", "Warm", "Cold", "Mobile site"] },
          { title: "1.6 Disaster Recovery (DR)", content: ["DR strategy", "Backup types:", "Full / Differential / Incremental", "Recovery phasing", "DR Plan testing:", "Checklist", "Simulation", "Parallel test"] },
          { title: "1.7 Personnel Security", content: ["Background checks", "Onboarding security", "Employee agreements (NDA, AUP)", "Separation of duties (SoD)", "Job rotation", "Termination process"] },
          { title: "1.8 Security Awareness & Training", content: ["Training levels:", "Awareness", "Training", "Education", "Social engineering prevention", "Role-based security education"] }
        ]
    },
    {
        id: 22,
        title: "DOMAIN 2: Asset Security",
        icon: 'database',
        color: "bg-slate-100 text-slate-600",
        subTopics: [
            { title: "2.1 Data Classification", content: ["Public / Internal / Confidential / Secret", "Regulatory data types", "Sensitivity levels", "Data labeling & handling"] },
            { title: "2.2 Data Ownership Roles", content: ["Data Owner", "Data Steward/Custodian", "Data Processor", "Data Controller", "Users"] },
            { title: "2.3 Privacy Protection", content: ["PII, PHI, PCI", "Data minimization", "Consent management", "Data governance programs"] },
            { title: "2.4 Data Lifecycle", content: ["Create", "Store", "Use", "Share/Transmit", "Archive", "Dispose/Destroy"] },
            { title: "2.5 Secure Data Storage", content: ["Encryption at rest", "Tokenization", "Data masking", "Secure containers"] },
            { title: "2.6 Secure Data Destruction", content: ["Wiping", "Degaussing", "Shredding", "Incineration", "Cryptographic erasure"] },
            { title: "2.7 Media Security", content: ["Media marking", "Media sanitization", "Media transportation SOPs"] }
        ]
    },
    {
        id: 23,
        title: "DOMAIN 3: Security Architecture & Engineering",
        icon: 'server',
        color: "bg-red-100 text-red-600",
        subTopics: [
            { title: "3.1 Secure Design Principles", content: ["Least privilege", "Fail-safe defaults", "Economy of mechanism", "Complete mediation", "Defense-in-depth"] },
            { title: "3.2 Security Models", content: ["Bell-LaPadula (Confidentiality)", "Biba (Integrity)", "Clark-Wilson model", "Brewer-Nash", "Information flow model"] },
            { title: "3.3 Security Architecture Frameworks", content: ["SABSA", "TOGAF", "Zachman", "OSA"] },
            { title: "3.4 Cryptography", content: ["Symmetric algorithms (AES, DES, 3DES)", "Asymmetric algorithms (RSA, ECC)", "Hashing (SHA-256, SHA-3)", "Digital signatures", "Key management lifecycle", "Public Key Infrastructure (PKI)", "Certificate lifecycle"] },
            { title: "3.5 Physical Security", content: ["Site design", "Fencing, lighting, access control", "Mantraps, turnstiles", "Fire suppression systems", "HVAC controls", "CCTV and guards"] },
            { title: "3.6 Secure Hardware", content: ["TPM (Trusted Platform Module)", "HSM (Hardware Security Module)", "Secure boot", "Side-channel attack prevention"] },
            { title: "3.7 Embedded Systems", content: ["IoT device security", "SCADA/ICS security", "Firmware protection"] },
            { title: "3.8 Virtualization & Cloud", content: ["Hypervisor security (Type 1, Type 2)", "Containerization", "Cloud service models (IaaS, PaaS, SaaS)", "Multi-tenancy security"] }
        ]
    },
    {
        id: 24,
        title: "DOMAIN 4: Communication & Network Security",
        icon: 'wifi',
        color: "bg-orange-100 text-orange-600",
        subTopics: [
            { title: "4.1 Network Architecture", content: ["OSI & TCP/IP models", "Network segmentation", "VLANs", "Subnetting"] },
            { title: "4.2 Secure Communication Channels", content: ["TLS/SSL", "IPSec", "SSH"] },
            { title: "4.3 Network Devices", content: ["Router security", "Switch security", "NGFW (Next-Gen Firewalls)", "IDS/IPS", "Network Access Control (NAC)"] },
            { title: "4.4 Wireless Networks", content: ["Wi-Fi standards", "WPA3 security", "EAP authentication"] },
            { title: "4.5 Attack & Defense", content: ["DNS Poisoning", "ARP Spoofing", "DoS/DDoS", "Session hijacking", "Zero Trust Network Architecture"] },
            { title: "4.6 VoIP, VPN, Mobile Networks", content: ["SIP security", "PPTP/L2TP/IPSec", "4G/5G threats"] }
        ]
    },
    {
        id: 25,
        title: "DOMAIN 5: Identity & Access Management",
        icon: 'key',
        color: "bg-amber-100 text-amber-600",
        subTopics: [
            { title: "5.1 Identification & Authentication", content: ["Factors of authentication", "Biometrics", "MFA"] },
            { title: "5.2 Access Control Models", content: ["DAC / MAC / RBAC / ABAC", "Mandatory vs Discretionary", "Privileged Access Management (PAM)"] },
            { title: "5.3 Identity Federation", content: ["SSO", "OAuth", "OpenID Connect", "SAML"] },
            { title: "5.4 Identity Lifecycle", content: ["Provisioning", "Deprovisioning", "Access certification", "Credential rotation"] },
            { title: "5.5 Access Attacks", content: ["Credential stuffing", "Password spraying", "Session hijacking"] }
        ]
    },
    {
        id: 26,
        title: "DOMAIN 6: Security Assessment & Testing",
        icon: 'scan',
        color: "bg-yellow-100 text-yellow-600",
        subTopics: [
            { title: "6.1 Assessment Types", content: ["Vulnerability scanning", "Penetration testing", "Audits (internal/external)"] },
            { title: "6.2 Testing Techniques", content: ["Static testing (SAST)", "Dynamic testing (DAST)", "Interactive testing (IAST)", "Fuzzing", "Regression testing"] },
            { title: "6.3 Security Controls Testing", content: ["Technical controls testing", "Administrative controls review", "Physical controls testing"] },
            { title: "6.4 Log Review & Security Monitoring", content: ["SIEM", "Syslog analysis"] },
            { title: "6.5 Reporting", content: ["Findings", "Recommendations", "Metrics & dashboards"] }
        ]
    },
    {
        id: 27,
        title: "DOMAIN 7: Security Operations",
        icon: 'shield-check',
        color: "bg-lime-100 text-lime-600",
        subTopics: [
            { title: "7.1 Incident Response", content: ["Identification", "Containment", "Eradication", "Recovery", "Lessons Learned"] },
            { title: "7.2 Digital Forensics", content: ["Chain of custody", "Evidence acquisition", "Disk forensics", "Memory forensics"] },
            { title: "7.3 Change & Configuration Management", content: ["Version control", "Configuration baselines"] },
            { title: "7.4 Patch Management", content: [] },
            { title: "7.5 Logging & Monitoring", content: ["SIEM operations", "Log correlation", "Threat hunting"] },
            { title: "7.6 Physical & Environmental Operations", content: ["HVAC", "UPS / Generators", "Fire suppression"] },
            { title: "7.7 Recovery Strategies", content: ["Backups", "DRP", "BCP"] }
        ]
    },
    {
        id: 28,
        title: "DOMAIN 8: Software Development Security",
        icon: 'code-bracket',
        color: "bg-green-100 text-green-600",
        subTopics: [
            { title: "8.1 Software Development Models", content: ["SDLC", "Agile", "DevOps", "DevSecOps"] },
            { title: "8.2 Threat Modeling", content: ["STRIDE", "DREAD", "Attack trees"] },
            { title: "8.3 Secure Coding", content: ["OWASP Top 10", "Input validation", "Memory protection", "Secure APIs"] },
            { title: "8.4 Software Security Testing", content: ["Code review", "Static testing", "Dynamic testing"] },
            { title: "8.5 Databases & Big Data", content: ["Database encryption", "SQL injection protection", "NoSQL security"] },
            { title: "8.6 CI/CD Pipeline", content: ["Tools security", "Build environment protection", "Dependency scanning"] }
        ]
    }
];

export const INITIAL_EXAM_DATA: Exam[] = [
    {
        id: 1,
        title: "CEH v13",
        description: "Certified Ethical Hacker v13 training modules covering everything from footprinting to cryptography.",
        modules: CEH_MODULES
    },
    {
        id: 2,
        title: "CISSP",
        description: "Certified Information Systems Security Professional modules covering security and risk management, asset security, and more.",
        modules: CISSP_MODULES
    }
];