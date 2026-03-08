# Firmatic

**Verifică. Facturează. Controlează.**

Romanian business intelligence + invoicing platform combining company verification (ANAF data), e-Factura invoicing, and AI-powered monitoring.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (TBD)
- **Auth:** Supabase Auth (TBD)
- **Deploy:** Vercel
- **Icons:** lucide-react
- **Font:** Inter

## Brand

- **Primary color:** Teal (oklch 0.55 0.15 175)
- **Navy:** oklch 0.2 0.04 260
- **Amber accent:** oklch 0.8 0.15 80
- **Tagline:** "Verifică. Facturează. Controlează."
- **Language:** Romanian (lang="ro")

## Color Rules

- ALWAYS use shadcn/ui semantic tokens (text-primary, bg-muted, etc.)
- NEVER hardcode colors (text-white, bg-slate-800, etc.)

## Project Structure

```
src/
  app/           — Next.js App Router pages
  components/
    ui/          — shadcn/ui components
  lib/           — utilities
```

## Key Features (Planned)

1. Company verification via ANAF API (CUI lookup, TVA, financial data)
2. e-Factura invoicing (ANAF XML API)
3. AI risk scoring for business partners
4. Company monitoring with alerts
5. AI assistant for natural language queries

## Git Rules

- NEVER push directly to main — use feature branches + PRs
- Branch naming: feat/short-description, fix/short-description
- Always sync before push: git fetch origin && git rebase origin/main
