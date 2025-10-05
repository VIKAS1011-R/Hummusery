# Vercel-Ready Next.js Template

A production-ready Next.js template optimized for Vercel deployment with TypeScript, Tailwind CSS, and ESLint.

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 📝 TypeScript for type safety
- 🔍 ESLint for code quality
- 🚀 Vercel deployment optimized
- 📡 API routes included

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see your app.

## API Routes

- `GET /api/hello` - Returns a welcome message
- `POST /api/hello` - Accepts and echoes back JSON data

## Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 3: Git Integration
1. Push your code to GitHub
2. Connect your repository at [vercel.com](https://vercel.com)
3. Deploy automatically on every push

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/hello/route.ts    # API endpoint
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
├── public/                       # Static assets
├── vercel.json                   # Vercel configuration
└── package.json
```

## Environment Variables

Create a `.env.local` file for local development:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, set environment variables in your Vercel dashboard.
