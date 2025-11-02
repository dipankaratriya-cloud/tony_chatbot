# Tony Seba AI Expert - Technology Disruption Framework

A professional AI-powered chat interface using Tony Seba's disruption framework with interactive prediction graphs. Built with Next.js, Groq AI, and Chart.js.

## Features

- **AI Chat Interface** - Real-time streaming responses powered by Groq's Mixtral model
- **Tony Seba Framework** - Built-in knowledge of disruption principles and timelines
- **Professional Graphs** - Dynamic S-curves, cost curves, and market share visualizations
- **Voice Input** - Browser-based speech recognition (Chrome/Edge)
- **Responsive Design** - Works seamlessly on all devices
- **Graph Types**:
  - S-Curve Adoption Patterns
  - Cost Decline Curves (Wright's Law)
  - Solar LCOE Projections
  - Market Share Transformations

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- Groq API Key (get free at https://console.groq.com)

### 2. Setup

Install dependencies:
```bash
npm install
```

### 3. Configure Environment

Add your Groq API key to `.env.local`:
```bash
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY_HERE
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Example Queries

Try asking:
- "Show me solar cost projections to 2035"
- "When will EVs reach 95% market share?"
- "Explain the energy disruption timeline"
- "What's the battery learning curve?"
- "Food industry disruption forecast"

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add your `GROQ_API_KEY` environment variable in the Vercel dashboard

4. Deploy to production:
```bash
vercel --prod
```

Your site will be live at: `https://your-project.vercel.app`

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **AI**: Groq SDK (Mixtral-8x7b model)
- **Charts**: Chart.js + React-Chartjs-2
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety

## Project Structure

```
tony-seba-ai/
├── app/
│   ├── page.tsx              # Main chat interface
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── chat/
│           └── route.ts      # Chat API endpoint
├── components/
│   └── GraphRenderer.tsx     # Graph visualization component
├── lib/
│   └── graphs/
│       └── graph-generator.ts # Graph generation logic
└── .env.local                # Environment variables
```

## Features Breakdown

### Tony Seba Framework Integration

The AI is pre-trained with Tony Seba's core disruption principles:
- **S-Curves**: Technology adoption patterns
- **Cost Curves**: Exponential improvement (Wright's Law)
- **Convergence**: Multiple technologies creating disruptions
- **Speed**: 10x faster than linear predictions

### Graph Types

1. **S-Curve Adoption**: Shows technology adoption over time
2. **Cost Decline**: Wright's Law learning curves
3. **Solar LCOE**: Levelized cost of energy projections
4. **Market Share**: Disruption transformations

### Voice Input

Click the microphone button to use voice input (requires Chrome or Edge browser).

## Development

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

Run linter:
```bash
npm run lint
```

## License

MIT

## Credits

Built with Claude Code. Powered by Groq AI.
Based on Tony Seba's technology disruption framework from RethinkX.
