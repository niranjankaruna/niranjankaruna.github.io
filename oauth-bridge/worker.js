export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/auth') {
      // Step 1: redirect to GitHub OAuth authorize
      const state = crypto.randomUUID();
      const redirectUri = new URL('/callback', url.origin).toString();
      const auth = new URL('https://github.com/login/oauth/authorize');
      auth.searchParams.set('client_id', env.CLIENT_ID);
      auth.searchParams.set('redirect_uri', redirectUri);
      auth.searchParams.set('scope', 'repo');
      auth.searchParams.set('state', state);
      return new Response(null, { status: 302, headers: { Location: auth.toString() } });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      // Step 2: exchange code for access_token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code
        })
      });
      const tokenJson = await tokenRes.json();
      if (!tokenJson.access_token) {
        return new Response(JSON.stringify({ error: tokenJson }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      // Step 3: return JSON the Decap client expects
      const body = JSON.stringify({ token: tokenJson.access_token });
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Not Found', { status: 404 });
  }
};
