export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questionnaireContent, extraNotes } = req.body;

  if (!questionnaireContent) {
    return res.status(400).json({ error: 'Questionnaire content is required' });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an expert AWS Solutions Architect specializing in Landing Zone Design Workshops (LZDW). You create UNIQUE, CLIENT-SPECIFIC architectures following AWS best practices.

# CORE REQUIREMENTS (NON-NEGOTIABLE):

1. **EVERY CLIENT IS UNIQUE** - No generic templates, no copy-paste
2. **PETRA MULTI-OU BASE PATTERN** - Always use Security OU + Workload OU + Networking OU
3. **EXTRACT REAL DATA** - Pull actual client name, apps, environments from questionnaire
4. **SMART ACCOUNT GENERATION** - Create 2-5 accounts per OU based on needs
5. **PROFESSIONAL QUALITY** - As if you're presenting to the client

# PETRA MULTI-OU PATTERN (BASE STRUCTURE):

## Security OU (ALWAYS INCLUDE):
- **Audit Account** - CloudTrail, Config, Access Analyzer
- **Log Archive Account** - Centralized logging, long-term retention
- **Security Tooling** (optional) - GuardDuty, SecurityHub if needed

## Workload OU (ADAPT TO CLIENT):
**IF client has environments (Dev/Staging/Prod):**
- Create separate accounts for EACH environment per major application
- Example: "App1 Production", "App1 Development", "App2 Production"

**IF client has 1-2 simple apps:**
- Create: Development Account, Staging Account, Production Account

**IF client has 5+ complex apps:**
- Group by environment: "Production Workloads", "Non-Production Workloads"
- OR create per-app if they're very distinct

**ALWAYS**: At least 2 accounts, maximum 5 accounts

## Networking OU (STANDARD):
- **Shared Services Account** - Transit Gateway, DNS, VPN
- **Network Account** (optional) - If multi-region or complex networking

# CLIENT NAME EXTRACTION:

Try these patterns in order:
1. Look for "[Company Name] Landing Zone" or "[Company Name] LZDW"
2. Check for "Client:" or "Company:" field
3. Look for domain in email addresses (e.g., @dialmate.ai → DialMate)
4. Check first line or title
5. If all fail, use "Client" as placeholder (but try HARD to find it)

# EMAIL PATTERN GENERATION:

IF emails mentioned in questionnaire:
- Use their actual domain/pattern

IF NO emails mentioned:
- Extract company name
- Generate pattern: [purpose]@[company-slug].com
- Example: audit@dialmate.com, dev@petra.com

# REGION SELECTION:

Priority order:
1. Extract from questionnaire ("Home region:", "Primary region:")
2. Infer from location (South Africa → af-south-1, Europe → eu-central-1)
3. Default to us-east-1 if unclear

# ACCOUNT NAMING RULES:

✅ GOOD:
- "DialMate Production Account"
- "Petra Development Environment"  
- "E-Tafakna Audit Account"

❌ BAD:
- "Workload Account 1"
- "Production"
- "Account"

# RESPONSE FORMAT (JSON ONLY):

{
  "client_name": "string (ACTUAL CLIENT NAME - NOT 'Client')",
  "workshop_date": "string (today's date if not in questionnaire)",
  "account_structure": {
    "pattern": "multi-ou-hierarchical",
    "master_account": {
      "name": "[CLIENT NAME] Master/Payer Account",
      "email": "[extracted or generated]@[domain].com",
      "purpose": "AWS Organizations root account for [CLIENT NAME], manages billing and organizational policies"
    },
    "security_ou": [
      {
        "name": "Audit Account",
        "email": "audit@[domain]",
        "purpose": "Centralized audit logging, AWS Config, Access Analyzer"
      },
      {
        "name": "Log Archive Account", 
        "email": "log-archive@[domain]",
        "purpose": "Long-term log retention and compliance storage"
      }
    ],
    "workload_ou": [
      {
        "name": "[CLIENT-SPECIFIC - based on their apps/environments]",
        "email": "[purpose]@[domain]",
        "purpose": "[what this account does for THIS client]"
      }
    ],
    "networking_ou": [
      {
        "name": "Shared Services Account",
        "email": "shared-services@[domain]",
        "purpose": "Transit Gateway, Route 53 Private Zones, VPN connections"
      }
    ]
  },
  "network_architecture": {
    "topology": "hub-spoke",
    "primary_region": "[from questionnaire or inferred]",
    "secondary_region": "[if DR mentioned, else null]",
    "vpc_design": "Multi-VPC architecture with Transit Gateway hub in Shared Services account"
  },
  "security_baseline": {
    "compliance_requirements": ["[from questionnaire - e.g., GDPR, HIPAA, SOC2, or 'General AWS best practices']"],
    "services": ["GuardDuty", "SecurityHub", "CloudTrail", "AWS Config", "IAM Identity Center"],
    "identity_center": true,
    "mfa_enforcement": true
  },
  "scope": {
    "in_scope": ["[specific deliverables for THIS client]"],
    "out_of_scope": ["[things they mentioned wanting later]"],
    "assumptions": ["[assumptions based on their questionnaire]"],
    "dependencies": ["[things they need to provide]"]
  },
  "implementation_roadmap": [
    {
      "phase": "Phase 1: Foundation (Weeks 1-4)",
      "tasks": ["Deploy AWS Control Tower", "Create OU structure", "Setup IAM Identity Center", "Establish account factory"],
      "duration": "4 weeks"
    },
    {
      "phase": "Phase 2: Security Baseline (Weeks 5-6)",
      "tasks": ["Enable GuardDuty", "Configure SecurityHub", "Setup CloudTrail", "Deploy AWS Config rules"],
      "duration": "2 weeks"
    },
    {
      "phase": "Phase 3: Networking (Weeks 7-8)",
      "tasks": ["Deploy Transit Gateway", "Create VPCs", "Setup routing", "Configure security groups"],
      "duration": "2 weeks"
    },
    {
      "phase": "Phase 4: Workload Migration (Weeks 9-12)",
      "tasks": ["[CLIENT-SPECIFIC - based on their applications]"],
      "duration": "4 weeks"
    }
  ]
}

# VALIDATION CHECKLIST (BEFORE RETURNING):

✅ Client name is NOT "Client" (it's ACTUAL name)
✅ Master account name contains client name  
✅ Security OU has 2-3 accounts
✅ Workload OU has 2-5 accounts with CLIENT-SPECIFIC names
✅ Networking OU has 1-2 accounts
✅ All emails use same domain pattern
✅ All account purposes are SPECIFIC to this client
✅ Implementation tasks mention CLIENT-SPECIFIC items

# CRITICAL RULES:

1. **NO GENERIC NAMES** - Every account name must be client-specific
2. **NO PLACEHOLDERS** - If you can't extract something, make an educated guess
3. **NO DUPLICATE NAMES** - Every account must have unique name
4. **MINIMUM ACCOUNTS** - Security OU: 2, Workload OU: 2, Networking OU: 1
5. **MAXIMUM ACCOUNTS** - Security OU: 3, Workload OU: 5, Networking OU: 2`
          },
          {
            role: "user",
            content: `Read this LZDW questionnaire CAREFULLY and create a UNIQUE AWS Landing Zone architecture for THIS SPECIFIC CLIENT.

QUESTIONNAIRE:
${questionnaireContent}

${extraNotes ? `\nADDITIONAL CONTEXT:\n${extraNotes}` : ''}

INSTRUCTIONS:
1. Find the CLIENT NAME (company name, not generic)
2. Identify their APPLICATIONS and ENVIRONMENTS
3. Extract EMAIL addresses or DOMAIN if mentioned
4. Find their HOME REGION or LOCATION
5. Understand their COMPLIANCE needs
6. Create CUSTOM account structure for THEIR needs

Return ONLY valid JSON (no markdown, no preamble). Make this architecture UNIQUE to this client!`
          }
        ],
        temperature: 0.3,
        max_tokens: 4500,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return res.status(response.status).json({ 
        error: `API request failed: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || '';
    
    // Clean JSON
    content = content.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    try {
      let architecture = JSON.parse(content);
      
      // ========================================
      // VALIDATION & FALLBACK LOGIC
      // ========================================
      
      // 1. CLIENT NAME VALIDATION
      if (!architecture.client_name || 
          architecture.client_name === 'Client' || 
          architecture.client_name.length < 2) {
        
        console.warn('⚠️ Generic client name detected, extracting from questionnaire...');
        
        // Try multiple patterns to extract client name
        const patterns = [
          /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+Landing\s+Zone/i,
          /(?:Client|Company):\s*([^\n,]+)/i,
          /@([a-z0-9-]+)\.(com|co|io|ai|net)/i, // domain name
          /^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/m, // first capitalized word(s)
        ];
        
        for (const pattern of patterns) {
          const match = questionnaireContent.match(pattern);
          if (match) {
            architecture.client_name = match[1].trim();
            console.log(`✅ Extracted client name: ${architecture.client_name}`);
            break;
          }
        }
        
        // If still no name, use date-based identifier
        if (!architecture.client_name || architecture.client_name === 'Client') {
          architecture.client_name = `Client-${new Date().toISOString().split('T')[0]}`;
          console.log(`⚠️ Using fallback name: ${architecture.client_name}`);
        }
      }
      
      // 2. MASTER ACCOUNT VALIDATION
      if (!architecture.account_structure?.master_account?.name?.includes(architecture.client_name)) {
        architecture.account_structure.master_account.name = 
          `${architecture.client_name} Master/Payer Account`;
      }
      
      // 3. EMAIL DOMAIN GENERATION
      const domain = architecture.client_name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      // Fix emails if they're missing or generic
      const fixEmail = (email, prefix) => {
        if (!email || email.includes('example.com') || email.includes('@domain')) {
          return `${prefix}@${domain}.com`;
        }
        return email;
      };
      
      architecture.account_structure.master_account.email = 
        fixEmail(architecture.account_structure.master_account.email, 'master');
      
      // 4. WORKLOAD OU VALIDATION (MINIMUM 2 ACCOUNTS)
      if (!architecture.account_structure.workload_ou || 
          architecture.account_structure.workload_ou.length < 2) {
        
        console.warn('⚠️ Insufficient workload accounts, generating defaults...');
        
        architecture.account_structure.workload_ou = [
          {
            name: `${architecture.client_name} Development Account`,
            email: `dev@${domain}.com`,
            purpose: "Development and testing environment"
          },
          {
            name: `${architecture.client_name} Production Account`,
            email: `prod@${domain}.com`,
            purpose: "Production workloads and customer-facing applications"
          }
        ];
      }
      
      // Limit to max 5 workload accounts
      if (architecture.account_structure.workload_ou.length > 5) {
        architecture.account_structure.workload_ou = 
          architecture.account_structure.workload_ou.slice(0, 5);
      }
      
      // 5. SECURITY OU VALIDATION (MINIMUM 2 ACCOUNTS)
      if (!architecture.account_structure.security_ou || 
          architecture.account_structure.security_ou.length < 2) {
        
        console.warn('⚠️ Insufficient security accounts, adding defaults...');
        
        architecture.account_structure.security_ou = [
          {
            name: "Audit Account",
            email: `audit@${domain}.com`,
            purpose: "Centralized audit logging and compliance monitoring"
          },
          {
            name: "Log Archive Account",
            email: `log-archive@${domain}.com`,
            purpose: "Long-term log storage and retention"
          }
        ];
      }
      
      // 6. NETWORKING OU VALIDATION (MINIMUM 1 ACCOUNT)
      if (!architecture.account_structure.networking_ou || 
          architecture.account_structure.networking_ou.length < 1) {
        
        console.warn('⚠️ No networking accounts, adding default...');
        
        architecture.account_structure.networking_ou = [
          {
            name: "Shared Services Account",
            email: `shared-services@${domain}.com`,
            purpose: "Transit Gateway, networking hub, shared resources"
          }
        ];
      }
      
      // 7. REGION VALIDATION
      if (!architecture.network_architecture?.primary_region) {
        // Try to infer from questionnaire
        const regionPatterns = [
          { pattern: /south\s*africa/i, region: 'af-south-1' },
          { pattern: /europe|eu-|frankfurt|ireland/i, region: 'eu-central-1' },
          { pattern: /us|america|virginia/i, region: 'us-east-1' },
          { pattern: /asia|singapore|tokyo/i, region: 'ap-southeast-1' },
        ];
        
        let foundRegion = 'us-east-1'; // default
        for (const {pattern, region} of regionPatterns) {
          if (pattern.test(questionnaireContent)) {
            foundRegion = region;
            break;
          }
        }
        
        if (!architecture.network_architecture) {
          architecture.network_architecture = {};
        }
        architecture.network_architecture.primary_region = foundRegion;
      }
      
      // 8. ENSURE ALL ACCOUNTS HAVE EMAILS
      const fixAccountEmails = (accounts, prefix) => {
        return accounts.map((acc, i) => ({
          ...acc,
          email: fixEmail(acc.email, `${prefix}-${i+1}`)
        }));
      };
      
      architecture.account_structure.security_ou = 
        fixAccountEmails(architecture.account_structure.security_ou, 'sec');
      architecture.account_structure.workload_ou = 
        fixAccountEmails(architecture.account_structure.workload_ou, 'work');
      architecture.account_structure.networking_ou = 
        fixAccountEmails(architecture.account_structure.networking_ou, 'net');
      
      // 9. FINAL VALIDATION LOG
      console.log('✅ Architecture validated:', {
        client: architecture.client_name,
        security_accounts: architecture.account_structure.security_ou.length,
        workload_accounts: architecture.account_structure.workload_ou.length,
        networking_accounts: architecture.account_structure.networking_ou.length,
        region: architecture.network_architecture.primary_region
      });
      
      return res.status(200).json({ architecture });
      
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse architecture response',
        message: parseError.message,
        rawContent: content.substring(0, 500)
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
