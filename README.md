# LM Studio Proxy with HTML Frontend

This project lets you expose your **LM Studio API** to friends via a simple website with password login. The API itself stays hidden on `127.0.0.1:1234`; your Express server acts as the gateway.

---

## Files

* **`index.html`** — the chat frontend. Edit this to change layout, styles, or JavaScript.
* **`server.js`** — the backend. Serves `index.html`, handles login, sets cookies, and proxies `/v1/*` requests to LM Studio.

---

## Requirements

* [Node.js v18+](https://nodejs.org/) installed (macOS: `brew install node`).
* [LM Studio](https://lmstudio.ai/) running with the API enabled on `127.0.0.1:1234`.

---

## Setup

```bash
# 1. Create project folder
mkdir lm-proxy && cd lm-proxy

# 2. Add files
# Copy index.html and server.js into this folder

# 3. Install dependencies
npm init -y
npm i express cookie-parser helmet http-proxy-middleware

# 4. Run LM Studio
# In LM Studio settings → API server: ON
# Host: 127.0.0.1, Port: 1234

# 5. Start the server
node server.js
```

Open [http://localhost:8080](http://localhost:8080).

---

## Usage

* Go to `/login`, enter the password.
* Once logged in, the site sets a secure cookie.
* The chat form on the page will send messages to `/v1/chat/completions`, which is proxied to LM Studio.

---

## Sharing with friends

Use [ngrok](https://ngrok.com/) (no router setup needed):

```bash
brew install ngrok/ngrok/ngrok
ngrok config add-authtoken <YOUR_NGROK_TOKEN>
ngrok http http://localhost:8080
```

Share the `https://random.ngrok.app` link with friends. They’ll see your login page, enter the password, and then use the chat interface.

---

## Tips

* Edit **only `index.html`** when you want to change the website’s look.
* Change **only the `PASSWORD` constant** in `server.js` when you want a new login password.
* Use `caffeinate -dimsu` on macOS to stop your laptop from sleeping while hosting.
* Don’t leave it running 24/7 — close ngrok and the server when you’re done.

---

## Security notes

* LM Studio should **always** stay bound to `127.0.0.1`.
* Cookies are set with `HttpOnly` and `SameSite=Lax`. For HTTPS tunnels (like ngrok), you can also set `secure: true`.
* Keep the password strong — don’t use something you also use elsewhere.

---

That’s it. Edit `index.html` for your frontend, and let `server.js` do the heavy lifting.
