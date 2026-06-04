# Laboratorul Lui Oscar

Platformă AI pentru proiecte DIY hardware în limba română, cu identitate Matrix / hacker / laborator de invenții.

## Stack

- Next.js 15, TypeScript, Tailwind CSS
- Supabase Auth + Postgres + RLS
- OpenAI API pentru generator
- Mermaid.js pentru wiring
- Three.js / React Three Fiber pentru viewer 3D
- jsPDF pentru export PDF
- Vercel deployment

## Configurare locală

```bash
npm install
npm run dev
```

Variabile necesare:

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://awceewlqdibjtwcqhtgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Supabase

```bash
supabase init
supabase login
supabase link --project-ref awceewlqdibjtwcqhtgh
supabase db push
```

Migrația este în `supabase/migrations/20260604193000_laboratorul_lui_oscar.sql`.

## Vercel

1. Creează un proiect Vercel din repository-ul GitHub.
2. Adaugă variabilele de mediu din `.env.example`.
3. Deploy cu framework preset Next.js.
