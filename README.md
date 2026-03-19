# GEO Analyzer

**Analyze any URL and get a 0–100 AI search visibility score.**

GEO Analyzer tells you how well your content performs in AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews — and gives you actionable fixes.

🌐 **Live:** [geoanalyzer-sigma.vercel.app](https://geoanalyzer-sigma.vercel.app)

---

## What It Does

Paste any URL and get a detailed GEO (Generative Engine Optimization) report in seconds:

- **Content Structure** — H1/H2 usage, heading hierarchy, internal links, word count
- **E-E-A-T Signals** — Author info, dates, citations, statistics, HTTPS + contact
- **Technical Readiness** — Meta tags, schema markup, Open Graph, canonical URL, server rendering
- **Content Quality** — AI-evaluated value, clarity, flow, Q&A format, originality
- **AI Search Optimization** — Snippable sentences, FAQ structure, definitions, lists, topic focus

Each category is scored out of 20, totalling a 0–100 score with a letter grade (A+ → F).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Auth | NextAuth v5 — Google OAuth, JWT sessions |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma v5 |
| AI — Primary | Groq (Llama 3.3 70B) |
| AI — Fallback | Google Gemini 2.0 Flash |
| Scraper | Cheerio (static HTML parsing) |
| UI | Base UI + Tailwind CSS v4 + shadcn |
| Charts | Recharts |
| Validation | Zod v4 |
| Deployment | Vercel |

---

## Features

- Google OAuth sign-in
- 3 free analyses per account
- Per-user analysis history
- Radar chart + per-category breakdowns
- Prioritized issue list (critical / warning / info)
- Dual AI with automatic fallback
- SSRF protection (private IPs blocked)
- Race-condition-safe atomic credit deduction

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Groq](https://console.groq.com) API key
- A [Google Gemini](https://aistudio.google.com) API key
- A Google OAuth app ([console.cloud.google.com](https://console.cloud.google.com))

### Setup

```bash
git clone https://github.com/akincskn/geoanalyzer.git
cd geoanalyzer
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://..."

AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

GROQ_API_KEY="..."
GEMINI_API_KEY="..."
```

Push the database schema:

```bash
npx prisma db push
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (run `npx auth secret` to generate) |
| `NEXTAUTH_URL` | Your app's base URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GROQ_API_KEY` | Groq API key |
| `GEMINI_API_KEY` | Google Gemini API key |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables listed above
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g. `https://your-app.vercel.app`)
5. Add `https://your-app.vercel.app/api/auth/callback/google` to your Google OAuth redirect URIs

Build command (already in `package.json`):
```
prisma generate && next build
```

---

## Known Limitations

- **JavaScript-only pages (SPAs):** Cheerio only parses static HTML. Client-rendered content will not be analyzed and will score lower.
- **PDFs / non-HTML responses:** The analyzer returns an error for non-HTML URLs.
- **Dynamic content:** Content loaded via API calls after page load is not captured.
- **Credits:** Currently fixed at 3 per account.

---

## Project Structure

```
app/
  (auth)/         # Login page
  (dashboard)/    # Analyze, report, and history pages
  (landing)/      # Marketing landing page
  api/            # analyze, credits, report API routes
components/
  analyze/        # URL form + loading animation
  auth/           # Google sign-in button
  dashboard/      # Navigation
  landing/        # Hero, Features, HowItWorks, Footer
  report/         # Score overview, category cards, radar chart
  ui/             # Base UI component wrappers
lib/
  ai/             # Groq + Gemini clients, prompt builder, result validator
  scoring/        # Score calculation and grade generation
  scraper/        # Cheerio-based page data extractors
  types/          # Shared TypeScript interfaces
  validations/    # Zod schemas
prisma/
  schema.prisma   # Database schema
```

---

## License

MIT
