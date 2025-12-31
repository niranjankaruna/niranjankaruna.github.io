# OAuth Bridge for Decap CMS (GitHub Backend)

Deploy a small OAuth bridge to exchange the GitHub OAuth `code` for an access token and return `{ token: "<github_access_token>" }` to the Decap client.

This example targets **Cloudflare Workers**. You can adapt it for other platforms.

## Setup

1. Create a GitHub OAuth App:
   - Homepage URL: `https://<your-site-domain>`
   - Authorization callback URL: `https://<your-bridge-domain>/callback`

2. Set worker environment variables:
   - `CLIENT_ID`
   - `CLIENT_SECRET`

3. Update `admin/config.yml` to point `auth_endpoint` at `https://<your-bridge-domain>/api/auth`.

## Local Test

Use `wrangler` to run the worker locally.

---

> Note: You should restrict admins in your repo and rotate secrets periodically.
