# Deployment Guide - Tony Seba AI Chat

## How to Share Your App with Others

### Option 1: Deploy to Vercel (Recommended - FREE)

**Vercel** is the easiest and fastest way to deploy Next.js apps. It's free for personal projects.

#### Steps:

1. **Create a GitHub Repository**
   ```bash
   cd /Users/dipankar/Documents/Tony_seba/tony-seba-ai
   git init
   git add .
   git commit -m "Initial commit - Tony Seba AI Chat"
   ```

2. **Push to GitHub**
   - Go to https://github.com and create a new repository
   - Follow the instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tony-seba-ai.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variable: `GROQ_API_KEY` = `your_api_key`
   - Click "Deploy"

4. **Share the URL**
   - Vercel will give you a URL like: `https://tony-seba-ai.vercel.app`
   - Share this URL with anyone!

---

### Option 2: Deploy to Netlify (FREE)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://www.netlify.com
   - Drag and drop your `.next` folder
   - Or connect your GitHub repo
   - Add environment variable: `GROQ_API_KEY`

---

### Option 3: Use ngrok (Temporary Local Sharing)

If you want to share your local development server temporarily:

1. **Install ngrok**
   ```bash
   brew install ngrok
   # or download from https://ngrok.com
   ```

2. **Run your dev server**
   ```bash
   npm run dev
   ```

3. **In another terminal, run ngrok**
   ```bash
   ngrok http 3000
   ```

4. **Share the URL**
   - ngrok will give you a URL like: `https://abc123.ngrok.io`
   - Share this with others (temporary - works only while your computer is on)

---

### Option 4: Deploy to Railway (FREE Tier)

1. **Go to https://railway.app**
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variable: `GROQ_API_KEY`
6. Railway will auto-deploy and give you a URL

---

### Option 5: VPS Deployment (DigitalOcean, AWS, etc.)

For production deployment on your own server:

1. **Build the production app**
   ```bash
   npm run build
   npm start
   ```

2. **Use PM2 to keep it running**
   ```bash
   npm install -g pm2
   pm2 start npm --name "tony-seba-ai" -- start
   pm2 save
   pm2 startup
   ```

3. **Set up Nginx reverse proxy** (optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Environment Variables Needed

Make sure to set these environment variables in your deployment platform:

```
GROQ_API_KEY=gsk_your_actual_key_here
```

---

## Important Notes

1. **Never commit `.env.local`** to GitHub (it's already in `.gitignore`)
2. **Always add `GROQ_API_KEY`** as an environment variable in your deployment platform
3. **Use HTTPS** for production (most platforms provide this automatically)
4. **Monitor API usage** on your GROQ dashboard

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Recommended: Vercel Deployment

**Why Vercel?**
- ✅ Free for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy environment variable management
- ✅ Automatic deployments on git push
- ✅ Zero configuration needed
- ✅ Made by Next.js creators

**Your app will be live at:** `https://your-app-name.vercel.app`

Share this URL with anyone and they can access your app from anywhere in the world! 🚀
