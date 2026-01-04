# Decor Rentals (Angular + Tailwind + Decap CMS)

A modern static Angular site for event décor rentals. Content is Git-backed via Decap CMS, deploys to GitHub Pages, and features Event Types, Products, Collections, and Categories with full relation management.

> ✅ **What's included**
>
> - Angular 18 standalone components with lazy loading
> - Tailwind CSS with animated balloon backgrounds  
> - Decap CMS at `/admin` with GitHub OAuth
> - Git-based content under `/content/**`
> - Dynamic collections: Categories, Event Types, Products, Collections
> - Relation widgets with reverse lookups
> - Auto-generated indexes (never committed to git)
> - Reference integrity validation + sitemap generator
> - GitHub Actions workflow for automated deployment
> - Clean, simple workflow: CMS → Main → Auto Deploy

---

## Quick Start

### 1) Prerequisites
- Node.js 20+
- GitHub repo with Pages enabled
- GitHub account for CMS access

### 2) Install & Run
```bash
npm install
./scripts/run-local.sh
```

Open http://localhost:4200

### 3) Deploy
Push to `main` branch - GitHub Actions automatically builds and deploys.

Site: **https://niranjankaruna.github.io/**

---

## Content Model

- **Categories** - Product categories
- **Event Types** - Birthday, Baby Shower, etc.
- **Products** - Individual rental items
- **Collections** - Curated packages with tiers

All use relations (no hardcoded dropdowns).

---

## Navigation

- `/events` - All event types
- `/collections` - All packages
- `/products` - All rental items
- `/search` - Search everything
- `/admin` - CMS (login required)

---

## Scripts

```bash
./scripts/run-local.sh      # Clean + dev server
npm run dev                 # Dev server only
npm run build               # Production build
./scripts/clean-ignored.sh  # Delete gitignored files
```

---

## Workflow

```
CMS Edit → Save → Commits to main → Auto Build & Deploy
```

No drafts, no approvals - direct publishing.

---

## License

MIT
