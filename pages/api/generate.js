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
            content: `You are an AWS Solutions Architect specializing in Landing Zone design. 

CRITICAL RULES:
- Base ALL recommendations on the provided LZDW questionnaire data
- Use ONLY proven AWS architecture patterns (Petra multi-OU, hub-spoke network, etc.)
- NEVER invent services or make assumptions not supported by the questionnaire
- Generate a structured JSON response with these exact fields

Your output MUST be valid JSON with this structure:
{
  "client_name": "string",
  "workshop_date": "string",
  "account_structure": {
    "pattern": "petra-multi-ou" | "simple-workload" | "hub-spoke",
    "master_account": { "name": "string", "email": "string", "purpose": "string" },
    "security_ou": [{ "name": "string", "email": "string", "purpose": "string" }],
    "workload_ou": [{ "name": "string", "email": "string", "purpose": "string" }],
    "networking_ou": [{ "name": "string", "email": "string", "purpose": "string" }]
  },
  "network_architecture": {
    "topology": "hub-spoke" | "transit-gateway" | "vpc-peering",
    "primary_region": "string",
    "secondary_region": "string | null",
    "vpc_design": "string description"
  },
  "security_baseline": {
    "compliance_requirements": ["string"],
    "services": ["GuardDuty", "SecurityHub", "Config", "CloudTrail", "etc"],
    "identity_center": "boolean",
    "mfa_enforcement": "boolean"
  },
  "scope": {
    "in_scope": ["Phase 1 item 1", "Phase 1 item 2"],
    "out_of_scope": ["Future enhancement 1", "Future enhancement 2"],
    "assumptions": ["Assumption 1", "Assumption 2"],
    "dependencies": ["Dependency 1", "Dependency 2"]
  },
  "implementation_roadmap": [
    { "phase": "Phase 1", "tasks": ["Task 1", "Task 2"], "duration": "string" }
  ]
}`
          },
          {
            role: "user",
            content: `Analyze this LZDW questionnaire and generate a professional AWS Landing Zone architecture.

QUESTIONNAIRE DATA:
${questionnaireContent}

${extraNotes ? `\nADDITIONAL CONTEXT:\n${extraNotes}` : ''}

Generate the architecture as valid JSON only. No preamble, no markdown, just the JSON object.`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
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
    const content = data.choices[0]?.message?.content || '';
    
    // Clean and parse JSON
    let cleanedContent = content.trim();
    cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    try {
      const architecture = JSON.parse(cleanedContent);
      return res.status(200).json({ architecture });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse architecture response',
        rawContent: cleanedContent.substring(0, 500)
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
