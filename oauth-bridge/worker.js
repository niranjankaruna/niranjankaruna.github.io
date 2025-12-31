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

      // Step 3: return HTML that performs the Decap CMS handshake protocol
      // The CMS expects a two-step handshake:
      // 1. Popup sends "authorizing:github" 
      // 2. Main window responds with same message
      // 3. Popup then sends "authorization:github:success:{token...}"
      const body = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>OAuth Callback</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; text-align: center; }
            .status { margin: 20px 0; padding: 10px; border-radius: 4px; }
            .success { background: #d4edda; color: #155724; }
            .error { background: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          <h3>GitHub Authorization</h3>
          <div id="status" class="status">Completing authentication...</div>
          <script>
            (function() {
              const provider = "github";
              const baseUrl = "${url.origin}";
              const token = "${tokenJson.access_token}";
              const statusEl = document.getElementById('status');
              
              function log(msg) {
                console.log('[OAuth Callback]', msg);
              }
              
              if (!window.opener) {
                statusEl.className = 'status error';
                statusEl.innerHTML = 'Error: This page must be opened from the Admin panel.<br>Please go back and try again.';
                return;
              }
              
              log('Starting handshake with opener');
              
              // Step 1: Send the handshake message
              const handshakeMsg = "authorizing:" + provider;
              log('Sending handshake: ' + handshakeMsg);
              window.opener.postMessage(handshakeMsg, "*");
              
              // Step 2: Listen for the handshake response from main window
              function handleMessage(e) {
                log('Received message: ' + e.data + ' from ' + e.origin);
                
                if (e.data === handshakeMsg) {
                  // Handshake confirmed! Now send the token
                  log('Handshake confirmed, sending token');
                  window.removeEventListener('message', handleMessage);
                  
                  const tokenData = { token: token, provider: provider };
                  const successMsg = "authorization:" + provider + ":success:" + JSON.stringify(tokenData);
                  
                  log('Sending success message: ' + successMsg);
                  window.opener.postMessage(successMsg, "*");
                  
                  statusEl.className = 'status success';
                  statusEl.innerHTML = 'Authentication successful!<br>This window will close automatically.';
                  
                  // Close after a short delay
                  setTimeout(function() { window.close(); }, 1000);
                }
              }
              
              window.addEventListener('message', handleMessage, false);
              
              // Fallback: If no handshake response after 5 seconds, try direct method
              setTimeout(function() {
                log('Handshake timeout - trying direct token send');
                const tokenData = { token: token, provider: provider };
                const successMsg = "authorization:" + provider + ":success:" + JSON.stringify(tokenData);
                window.opener.postMessage(successMsg, "*");
                
                statusEl.className = 'status success';
                statusEl.innerHTML = 'Authentication sent.<br>You can close this window.';
              }, 5000);
            })();
          </script>
        </body>
        </html>
      `;
      return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  }
};
