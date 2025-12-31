# Decor Site Starter (Angular + Tailwind + Decap CMS)

A static Angular site for an event décor rental business. Content is Git-backed (Decap CMS), deploys to GitHub Pages, and models Event Types, Products, and Decor Packages with tiered compositions.

> ✅ **What’s included**
>
> - Angular standalone app (no auth for public site)
> - Tailwind CSS
> - Decap CMS at `/admin`
> - Git-based content under `/content/**`
> - Sample schema for event types, products, packages + tiers
> - Image galleries (in Git) + YouTube (unlisted) video embeds
> - Reference integrity checker + content indexer + sitemap generator
> - GitHub Actions workflow for Pages
>
> 🔒 **Admin Login** uses GitHub OAuth via an OAuth bridge you deploy (e.g., Cloudflare Worker). See `oauth-bridge/README.md`.

---

## Quick Start

### 1) Prereqs
- Node.js 20+
- GitHub repo with Pages enabled (build from GitHub Actions)
- Admin GitHub account(s)

### 2) Install dependencies
```bash
npm install
```

### 3) Run locally
```bash
# generates content indexes + sitemap, validates refs, runs dev server
npm run dev
```

Open http://localhost:4200. Admin UI is at http://localhost:4200/admin (login requires OAuth bridge; without it you can still view the UI shell).

### 4) Configure Decap GitHub OAuth
1. Create a **GitHub OAuth App** with homepage `https://<your-domain>` and callback `https://<your-bridge-domain>/callback`.
2. Deploy the bridge in `oauth-bridge/` (Cloudflare Worker example included). Set env vars CLIENT_ID and CLIENT_SECRET.
3. Update `admin/config.yml`:
   ```yml
   backend:
     name: github
     repo: <your-org-or-user>/<your-repo>
     branch: main
     auth_endpoint: https://<your-bridge-domain>/api/auth
   ```

### 5) Deploy to GitHub Pages
Push to `main`. The workflow at `.github/workflows/deploy.yml` builds and deploys automatically. It sets `--base-href` to `/${{ github.event.repository.name }}/` for Pages on user/org repos.

If using a **custom domain**, set `--base-href "/"` in the workflow and configure your DNS + Pages custom domain.

---

## Content Model

- `content/event-types/<slug>.json`
- `content/products/<slug>.json`
- `content/packages/<slug>.json` (with `tiers[].items[].product` referencing product slugs)

Run `npm run validate` to ensure all package tier items reference existing products.

### Indexes
Build scripts will generate:
- `content/event-types/index.json`
- `content/products/index.json`
- `content/packages/index.json`

These power the home/event/search pages and reverse lookups.

---

## Scripts

- `npm run dev` – validate, build indexes, generate sitemap, and start dev server
- `npm run validate` – checks cross-references (products used by package tiers exist)
- `npm run build` – builds production with dynamic `--base-href` for GitHub Pages
- `npm run build:local` – builds production with `--base-href /` for local/custom-domain hosting

---

## YouTube Videos

Add unlisted video URLs to the `videos` arrays on products or packages. The site embeds them on detail pages. Avoid storing video files in Git.

---

## Portability

Everything is static + Git-backed. You can migrate hosting/CI providers by copying the repo and swapping the deploy workflow. Decap CMS works with any Git provider backend (you can switch `backend:` in `admin/config.yml`).

---

## License

MIT – do what you like, attribution appreciated.
