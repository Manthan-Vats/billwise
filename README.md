# BillWise

BillWise is a modern bill-splitting web app built with React, TypeScript, Vite and Supabase.

## Features

- 🔐 Google & email/password authentication via Supabase
- 🧮 Precise balance calculation and debt simplification
- 💸 Supports multiple expense categories (food, transport, accommodation, …)
- 🌐 Multi-currency display (₹, $, …) with intelligent rounding tolerance
- 📊 Responsive UI built with TailwindCSS

## Development

```bash
# install deps
pnpm install

# start dev server
pnpm dev

# run tests
pnpm test
```

## Deployment

BillWise is ready for Netlify / Vercel. Set environment variables:

```
VITE_SUPABASE_URL=…
VITE_SUPABASE_ANON_KEY=…
```

---
MIT License © 2024 Manthan
