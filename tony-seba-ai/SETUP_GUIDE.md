# Tony Seba AI Expert - Quick Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- A code editor (VS Code recommended)
- A Groq API account (free)

## Step 1: Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in with your account
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy your API key (starts with `gsk_`)
6. **Save it somewhere safe** - you'll need it in the next step

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `gsk_YOUR_GROQ_API_KEY_HERE` with your actual Groq API key:

```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

3. Save the file

**Important**: Never commit your `.env.local` file to version control!

## Step 3: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- Next.js 16
- Groq SDK
- Chart.js
- Framer Motion
- Tailwind CSS
- And more...

## Step 4: Start Development Server

Run the development server:

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
```

## Step 5: Open in Browser

1. Open your browser (Chrome or Edge recommended for voice input)
2. Go to [http://localhost:3000](http://localhost:3000)
3. You should see the Tony Seba AI Expert interface

## Step 6: Test the Application

### Test Chat Functionality

Try these example queries:
1. "Show me solar PV cost projections"
2. "When will EVs hit 95% market share?"
3. "Energy disruption timeline"

### Test Graph Generation

When you ask questions about:
- **EVs or Transportation** → EV adoption curves
- **Solar or Energy** → Solar cost projections
- **Cost or Wright's Law** → Technology cost curves

Click "View Graphs" button to see visualizations.

### Test Voice Input (Optional)

1. Click the 🎤 microphone button
2. Allow microphone access when prompted
3. Speak your question clearly
4. The text will appear in the input field

**Note**: Voice input only works in Chrome and Edge browsers.

## Troubleshooting

### "Failed to fetch" or API errors

- Check that your Groq API key is correct in `.env.local`
- Restart the dev server after changing environment variables
- Verify you have internet connection

### Graphs not showing

- Make sure you're asking questions related to energy, EVs, or technology costs
- Check browser console for errors (F12)
- Refresh the page

### Voice input not working

- Only works in Chrome and Edge browsers
- Click "Allow" when browser asks for microphone permission
- Check your microphone is working in system settings

### Build errors

Run these commands to clean and rebuild:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## Next Steps

### Deploy to Vercel

Once everything works locally:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run deployment:
```bash
vercel
```

3. Follow the prompts
4. Add your `GROQ_API_KEY` in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `GROQ_API_KEY` = `your_key`

5. Deploy to production:
```bash
vercel --prod
```

### Customize the Application

- **Add more graphs**: Edit `lib/graphs/graph-generator.ts`
- **Modify AI behavior**: Edit `app/api/chat/route.ts` (SEBA_FRAMEWORK section)
- **Change styling**: Edit Tailwind classes in `app/page.tsx`
- **Add new features**: Create new components in `components/`

## File Structure Reference

```
tony-seba-ai/
├── .env.local                     ← Your API key goes here
├── package.json                   ← Dependencies
├── next.config.js                 ← Next.js configuration
├── app/
│   ├── page.tsx                   ← Main chat interface
│   ├── layout.tsx                 ← App layout and metadata
│   ├── globals.css                ← Global styles
│   └── api/chat/route.ts          ← AI chat endpoint
├── components/
│   └── GraphRenderer.tsx          ← Graph visualization
└── lib/graphs/
    └── graph-generator.ts         ← Graph generation logic
```

## Support

If you run into issues:
1. Check the main README.md for detailed documentation
2. Verify all environment variables are set correctly
3. Make sure you're using Node.js 18+
4. Try clearing `.next` folder and rebuilding

## Success Checklist

- [ ] Groq API key obtained and added to `.env.local`
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts without errors
- [ ] Application loads at http://localhost:3000
- [ ] Chat responses work
- [ ] Graphs generate and display
- [ ] (Optional) Voice input works

Once all items are checked, you're ready to go!

---

**Built with**: Next.js 16 • Groq AI • Chart.js • Tailwind CSS
**Framework**: Tony Seba's Technology Disruption Principles from RethinkX
