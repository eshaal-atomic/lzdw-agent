# 🚀 DEPLOYMENT GUIDE - Step by Step

## You Have 2 Options:

### OPTION 1: Deploy via Vercel Website (EASIEST - 5 minutes)
### OPTION 2: Deploy via GitHub + Vercel (Professional - 10 minutes)

---

# OPTION 1: Deploy via Vercel Website (RECOMMENDED)

## ✅ Step 1: Get FREE Groq API Key (2 minutes)

1. Open https://console.groq.com/ in new tab
2. Click **"Start Building"** or **"Sign Up"**
3. Sign up with Google/GitHub (instant, **NO CREDIT CARD** needed)
4. You'll land on the dashboard
5. Click **"API Keys"** in left sidebar
6. Click **"Create API Key"**
7. Give it a name: `LZDW Agent Production`
8. **COPY THE KEY** - it starts with `gsk_`
   - ⚠️ Save it somewhere - you can always regenerate if lost

**Why Groq?**
- ✅ 100% FREE (no credit card required)
- ✅ Super fast (fastest inference in the world)
- ✅ Llama 3.3 70B is excellent for structured outputs
- ✅ 14.29 requests/second (way more than you need)

## ✅ Step 2: Prepare Project Folder

**YOU NEED TO DO THIS:**
1. Download the `lzdw-site` folder I created (it's in your outputs)
2. ZIP the entire folder:
   - Right-click on `lzdw-site` folder
   - Select "Compress" or "Send to → Compressed folder"
   - You should have `lzdw-site.zip`

## ✅ Step 3: Deploy to Vercel (2 minutes)

1. Open https://vercel.com/new
2. Click **"Continue with GitHub"** (or Email, Google, etc.)
3. Create account / Log in
4. You'll see "Import Git Repository" page
5. **IGNORE the Git stuff** - scroll down to bottom
6. Find **"Or, import from a local folder"** section
7. Click **"Upload"** button
8. Select your `lzdw-site.zip` file
9. Wait for upload to finish

## ✅ Step 4: Configure Project

1. **Project Name**: Type `lzdw-agent` (or whatever you want)
2. **Framework Preset**: Should auto-detect "Next.js" ✅
3. **Root Directory**: Leave as `./`
4. **Build Settings**: Leave defaults

## ✅ Step 5: Add Environment Variable (CRITICAL)

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"**
3. **Key**: Type exactly `GROQ_API_KEY`
4. **Value**: Paste your API key from Step 1 (the `gsk_...` one)
5. Make sure it's set for **Production** (should be checked by default)

## ✅ Step 6: Deploy

1. Click the big **"Deploy"** button
2. Wait 2-3 minutes (Vercel will build your site)
3. You'll see a success screen with confetti 🎉

## ✅ Step 7: Get Your URL

1. You'll see your site URL: `https://lzdw-agent.vercel.app`
   - (Vercel might give you a random name like `lzdw-agent-abc123.vercel.app`)
2. Click **"Visit"** to test it

## ✅ Step 8: Test It

1. Open your site URL
2. Copy-paste the DOCH LZDW test data (I gave you the .txt file)
3. Click **"Generate AWS Architecture"**
4. Wait 20 seconds
5. Should show results + Download buttons

## ✅ Step 9: Share with Team

Send them the URL: `https://your-site.vercel.app`

**DONE! Your team can now use it.**

---

# OPTION 2: Deploy via GitHub (More Professional)

## Prerequisites
- GitHub account
- Git installed on your computer

## Steps

### 1. Create GitHub Repository

```bash
# Navigate to project folder
cd path/to/lzdw-site

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LZDW Agent"

# Create repo on GitHub.com (via website)
# Then link it:
git remote add origin https://github.com/YOUR_USERNAME/lzdw-agent.git
git branch -M main
git push -u origin main
```

### 2. Connect Vercel to GitHub

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your repos
5. Select your `lzdw-agent` repository
6. Click **"Import"**

### 3. Configure (same as Option 1 Step 4-5)

1. Add `CLAUDE_API_KEY` environment variable
2. Click **"Deploy"**

### 4. Auto-Deployments

Now every time you push to GitHub, Vercel auto-deploys! 🚀

---

# TROUBLESHOOTING

## Error: "API request failed: 401"
**Cause**: Groq API key is wrong or not set  
**Fix**:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click **"Settings"** tab
4. Click **"Environment Variables"**
5. Find `GROQ_API_KEY`
6. Click **"Edit"**
7. Paste correct API key (get new one from console.groq.com if needed)
8. Click **"Save"**
9. Go to **"Deployments"** tab
10. Click **"..."** on latest deployment
11. Click **"Redeploy"**

## Error: "Module not found: mammoth"
**Cause**: Dependencies didn't install  
**Fix**:
1. Go to your project on Vercel
2. Click **"Deployments"** tab
3. Click **"..."** → **"Redeploy"**
4. Check **"Use existing Build Cache"** is OFF
5. Click **"Redeploy"**

## Error: "Failed to parse DOCX"
**Cause**: File is corrupted or not a real DOCX  
**Fix**: Tell user to copy-paste content instead of uploading file

## Site is slow
**Cause**: Free tier has cold starts  
**Fix**: Upgrade to Vercel Pro ($20/mo) for instant responses

---

# AFTER DEPLOYMENT

## Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel Dashboard → Settings → Domains
3. Click **"Add"**
4. Type your domain: `lzdw-agent.yourdomain.com`
5. Follow DNS instructions
6. Wait 10 minutes for DNS propagation

## Monitoring

- View logs: Vercel Dashboard → Deployments → Click latest → **Logs** tab
- Check errors: Logs will show API failures, parsing errors, etc.
- Groq rate limit: 14.29 requests/sec (you won't hit this unless stress testing)

## Updating

**If you deployed via Vercel website:**
1. Make changes locally
2. ZIP the folder again
3. Go to Vercel Dashboard
4. Click **"Visit Git"** (top right)
5. Import from local folder again
6. Vercel will update existing project

**If you deployed via GitHub:**
1. Make changes locally
2. `git add .`
3. `git commit -m "Update"`
4. `git push`
5. Vercel auto-deploys in 2 minutes

---

# NEED HELP?

Ask your senior to check:
- Vercel deployment logs
- Environment variables are set correctly (`GROQ_API_KEY`)
- API key is valid (test at console.groq.com - should show API key details)

Or DM me on Slack!
