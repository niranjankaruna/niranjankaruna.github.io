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

## Admin & OAuth Bridge

### OAuth Bridge Worker
The OAuth bridge is a **Cloudflare Worker** that handles GitHub authentication for Decap CMS.

**Location:**
- Cloudflare Dashboard: https://dash.cloudflare.com/
- Managed by: `niranjankaruna` account
- Worker URL: `https://oauth-bridge.decor-rentals.workers.dev`
- Source code: `/oauth-bridge/worker.js`

**Setup:**
1. Create a GitHub OAuth App:
   - Go to GitHub → Settings → Developer settings → OAuth Apps → create new app
   - Set homepage URL to your site domain
   - Set Authorization callback URL to: `https://oauth-bridge.decor-rentals.workers.dev/callback`

2. Store credentials as Cloudflare Worker secrets:
   ```bash
   cd oauth-bridge
   npx wrangler secret put CLIENT_ID          # Paste GitHub OAuth App Client ID
   npx wrangler secret put CLIENT_SECRET      # Paste GitHub OAuth App Client Secret
   ```

3. Deploy changes:
   ```bash
   npx wrangler deploy
   ```

**Maintenance:**
- Rotate CLIENT_SECRET periodically
- Check Cloudflare dashboard for worker logs/errors
- Only the Cloudflare account owner can manage this worker

---

## License

MIT
