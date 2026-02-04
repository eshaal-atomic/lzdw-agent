# AWS Landing Zone Design Workshop Agent

Automated architecture generator for AWS Landing Zone Design Workshops.

## Features

✅ **Upload .docx or .txt questionnaires** - Automatic parsing  
✅ **AI-powered architecture generation** - Uses Llama 3.3 70B (via Groq - FREE & FAST)  
✅ **Professional Draw.io diagrams** - Downloadable .drawio files  
✅ **JSON export** - Full architecture as structured data  
✅ **Zero hallucinations** - Pattern-based recommendations  
✅ **Scope definition** - Prevents scope creep  

---

## Quick Deploy to Vercel (5 minutes)

### Step 1: Get FREE Groq API Key

1. Go to https://console.groq.com/
2. Sign up with Google/GitHub (instant, no credit card)
3. Click "API Keys" in sidebar
4. Click "Create API Key"
5. Give it a name: `LZDW Agent`
6. Copy the key (starts with `gsk_`)

### Step 2: Deploy to Vercel

**Option A: Deploy via Vercel Dashboard (EASIEST)**

1. Go to https://vercel.com/new
2. Import this project:
   - If you have it on GitHub: Select the repository
   - If not: Upload the `lzdw-site` folder as ZIP
3. Add environment variable:
   - Key: `GROQ_API_KEY`
   - Value: Your API key from Step 1 (starts with `gsk_`)
4. Click **Deploy**
5. Wait 2 minutes
6. Get your URL: `https://your-project.vercel.app`

**Option B: Deploy via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd lzdw-site

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: lzdw-agent
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add CLAUDE_API_KEY

# Paste your API key when prompted
# Choose "Production"

# Deploy to production
vercel --prod
```

### Step 3: Share with Team

Your website will be live at: `https://lzdw-agent.vercel.app` (or your custom URL)

Team members can:
1. Visit the URL
2. Upload `.docx` or paste questionnaire
3. Click "Generate"
4. Download Draw.io diagram and JSON

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Groq API key to .env
# GROQ_API_KEY=gsk_your-key-here

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## How It Works

1. **User uploads LZDW questionnaire** (.docx or .txt file)
2. **Backend parses the file** (extracts text from DOCX)
3. **Groq API analyzes content** (Llama 3.3 70B - identifies requirements, patterns)
4. **Generates architecture** (account structure, network, security)
5. **Creates Draw.io diagram** (visual representation)
6. **User downloads outputs** (.drawio file and .json export)

---

## Architecture Pattern Examples

### Petra Multi-OU (Default)
```
Master/Payer Account
├── Security OU
│   ├── Log Archive
│   └── Audit
├── Workload OU
│   ├── Production
│   ├── Staging
│   └── Development
└── Networking OU
    └── Shared Services
```

### Simple Workload
```
Master/Payer Account
├── Security OU
│   └── Audit
└── Workload OU
    ├── Production
    └── Non-Production
```

---

## Troubleshooting

### "API request failed: 401"
- Your Groq API key is invalid or not set
- Go to Vercel Dashboard → Settings → Environment Variables
- Update `GROQ_API_KEY` with valid key
- Redeploy

### "Failed to parse DOCX file"
- File might be corrupted
- Try exporting as .txt instead
- Or copy-paste content into the text area

### "Internal server error"
- Check Vercel logs: Dashboard → Deployments → Click latest → Logs
- Most likely: API key issue or invalid questionnaire format

---

## Tech Stack

- **Framework**: Next.js 14
- **AI**: Llama 3.3 70B via Groq (FREE API, super fast)
- **Hosting**: Vercel (free tier)
- **File Parsing**: Mammoth.js (DOCX)
- **Diagram Format**: Draw.io XML

---

## Cost

- **Vercel Hosting**: FREE (unlimited bandwidth, HTTPS included)
- **Groq API**: FREE (14.29 requests/sec rate limit, more than enough)
- **Total**: 100% FREE

---

## Support

Issues? Check:
- Vercel deployment logs
- Environment variables are set correctly (`GROQ_API_KEY`)
- API key is valid (test at console.groq.com)
