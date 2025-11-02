# Important Notes for Tony Seba AI Expert

## Before You Start

### 1. Get Your Groq API Key (REQUIRED)

**You must have a Groq API key for this application to work!**

1. Visit: [https://console.groq.com](https://console.groq.com)
2. Create a free account
3. Generate an API key
4. Copy the key (starts with `gsk_`)
5. Add it to `.env.local` file:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

**Without this key, the AI chat will not work!**

## Environment Variables

The `.env.local` file is already created with a placeholder. You need to:
1. Open `.env.local`
2. Replace `gsk_YOUR_GROQ_API_KEY_HERE` with your actual key
3. Save the file
4. Restart the dev server if it's already running

## Quick Start Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Application Features

### What Works Out of the Box

✅ **AI Chat Interface**
- Real-time streaming responses
- Context-aware conversations
- Tony Seba framework knowledge built-in

✅ **Professional Graphs**
- S-Curve adoption patterns
- Cost decline curves (Wright's Law)
- Solar LCOE projections
- Market share transformations
- Interactive graph switching

✅ **Voice Input**
- Browser-based speech recognition
- Works in Chrome and Edge
- Click microphone button to activate

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Split-panel layout with graphs
- Smooth animations

### Graph Triggers

Graphs automatically generate when you ask about:
- **"EV" or "electric" or "transport"** → EV adoption + market share
- **"solar" or "energy"** → Solar costs + energy transformation
- **"cost" or "wright"** → Technology cost curves

## Technology Stack

- **Next.js 16**: Latest version with App Router
- **Groq AI**: Fast inference with Mixtral-8x7b model
- **Chart.js**: Professional graph rendering
- **Framer Motion**: Smooth animations
- **Tailwind CSS v4**: Modern styling
- **TypeScript**: Full type safety

## File Purposes

### Core Application Files

1. **`app/page.tsx`**
   - Main chat interface
   - Message handling
   - Voice input logic
   - Graph panel management

2. **`app/api/chat/route.ts`**
   - AI API endpoint
   - Groq integration
   - Streaming responses
   - Tony Seba framework prompts

3. **`lib/graphs/graph-generator.ts`**
   - Graph generation logic
   - S-curve calculations
   - Cost curve algorithms
   - Query parsing

4. **`components/GraphRenderer.tsx`**
   - Chart.js integration
   - Graph switching
   - Responsive rendering

### Configuration Files

- **`next.config.js`**: Next.js settings
- **`package.json`**: Dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration
- **`.env.local`**: Environment variables (API keys)

## Customization Guide

### Change AI Model

Edit `app/api/chat/route.ts`:
```typescript
model: 'mixtral-8x7b-32768',  // Change to another Groq model
```

### Add New Graph Types

Edit `lib/graphs/graph-generator.ts`:
1. Add new graph generation function
2. Add trigger in `generateGraphsForQuery()`

### Modify AI Behavior

Edit `app/api/chat/route.ts` → `SEBA_FRAMEWORK.systemPrompt`:
```typescript
const SEBA_FRAMEWORK = {
  systemPrompt: `Your custom instructions here...`
};
```

### Update Styling

Edit Tailwind classes in:
- `app/page.tsx` - Main interface
- `components/GraphRenderer.tsx` - Graph panel

## Common Issues & Solutions

### Issue: "Failed to fetch" error
**Solution**: Check your Groq API key is correctly set in `.env.local`

### Issue: Graphs not appearing
**Solution**: Make sure you're asking questions with keywords like "EV", "solar", "energy", "cost"

### Issue: Voice input not working
**Solution**:
- Only works in Chrome/Edge
- Must allow microphone permissions
- Check microphone is working in system settings

### Issue: Build errors
**Solution**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Performance Notes

- First message may take 2-3 seconds (cold start)
- Subsequent messages are faster (< 1 second)
- Graphs render instantly (client-side)
- Streaming provides real-time responses

## Security Notes

- Never commit `.env.local` to version control
- Keep your Groq API key private
- Don't share your API key in screenshots
- Regenerate key if accidentally exposed

## Deployment Checklist

Before deploying to Vercel:

- [ ] Test locally with `npm run dev`
- [ ] Verify all graphs generate correctly
- [ ] Test chat responses
- [ ] Run `npm run build` successfully
- [ ] Have Groq API key ready to add to Vercel

After deploying:

- [ ] Add `GROQ_API_KEY` environment variable in Vercel
- [ ] Test the deployed site
- [ ] Check API responses work
- [ ] Verify graphs render

## Cost Information

- **Groq API**: Free tier available (very generous limits)
- **Vercel Hosting**: Free for hobby projects
- **Total Cost**: $0 for small-scale usage

## Support & Resources

- **Groq Docs**: [https://console.groq.com/docs](https://console.groq.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Chart.js Docs**: [https://www.chartjs.org/docs](https://www.chartjs.org/docs)
- **Tony Seba/RethinkX**: [https://www.rethinkx.com](https://www.rethinkx.com)

## Project Status

✅ **Fully Functional** - Ready to use
✅ **Production Ready** - Can be deployed
✅ **Well Documented** - README and guides included
✅ **Type Safe** - Full TypeScript support
✅ **Modern Stack** - Latest versions of all tools

## Next Steps

1. Get your Groq API key
2. Add it to `.env.local`
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000
6. Start chatting!

---

**Enjoy your Tony Seba AI Expert application!**

Built with Next.js, Groq AI, and Chart.js
Powered by Claude Code
