# Free Deployment Guide

## Step 1: Push to GitHub (Free)

1. **Create GitHub Repository:**
   - Go to github.com and create a new repository
   - Name it `plagiarism-detector` or any name you prefer
   - Make it public (required for free deployment)

2. **Upload Your Code:**
   - Download all files from this Replit project
   - Upload them to your GitHub repository
   - Or use Git commands if you know them

## Step 2: Deploy on Vercel (100% Free Forever)

**Why Vercel:**
- Completely free for personal projects
- No credit card required
- Unlimited deployments
- Free SSL certificate
- 100GB bandwidth per month

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up" and choose "Continue with GitHub"
3. Click "Import Project"
4. Select your `plagiarism-detector` repository
5. Vercel will auto-detect it's a Node.js project
6. Click "Deploy" (it will build automatically)
7. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add: `GOOGLE_API_KEY` = your Google API key
   - Add: `GOOGLE_SEARCH_ENGINE_ID` = your search engine ID
8. **Redeploy:** Go to Deployments tab → Click "..." → Redeploy

**Result:** Your app will be live at `https://your-project-name.vercel.app`

## Step 3: Alternative - Netlify (Also 100% Free)

If Vercel doesn't work:
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variables in Site Settings
8. Deploy

## Step 4: Share Your Live Website

Once deployed, you'll get a URL like:
- `https://plagiarism-detector.vercel.app`
- `https://amazing-app-123.netlify.app`

Your plagiarism detection tool will be accessible worldwide for free!

## Troubleshooting

**If deployment fails:**
- Check the build logs in your deployment platform
- Make sure all environment variables are set
- Verify your Google API credentials are correct

**If API doesn't work:**
- The app has fallback detection that works without Google API
- Add your Google credentials for full functionality