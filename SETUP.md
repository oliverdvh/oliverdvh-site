# How to get this site live (and edit it yourself)

There are five steps. None of them require coding. Plan for about **45–60 minutes** end to end, working through them in order.

1. Put the code on GitHub (free account, ~10 min)
2. Connect Cloudflare Pages to that GitHub repo (free account, ~10 min)
3. Point your domain at Cloudflare (~15 min, mostly waiting)
4. Wire up Decap CMS so you can edit pages (~10 min)
5. First test edit — make a typo change in your browser, watch the site rebuild

Take your time. Each step is independent — you can stop after step 3 and the site will be live; you just won't have the editor yet.

---

## Before you start

Have ready:
- **The zip file** of this project I sent you (let's call it `oliverdvh-site.zip`). Unzip it somewhere obvious like your Desktop.
- **Your Namecheap login** for `oliverdudokvanheel.com`.
- **30 seconds patience** between Cloudflare deploys — they're fast but not instant.

---

## Step 1 — Put the code on GitHub

GitHub is where the source lives. Cloudflare watches GitHub for changes and rebuilds the site. Decap CMS edits files on GitHub when you click Publish in the browser.

### 1a. Create your GitHub account

1. Go to [github.com/signup](https://github.com/signup).
2. Email: `oliver.dudokvanheel@cisl.cam.ac.uk` (or any email you like — this is just for login).
3. Pick a password, pick a username (suggestion: `oliverdudokvanheel`).
4. Verify your email when GitHub sends the link.
5. On the "Welcome" screen, you can skip team setup — just click through.

### 1b. Make a new repository

1. In the top-right corner of github.com, click the **+** and choose **New repository**.
2. **Repository name:** `oliverdvh-site` (must match exactly).
3. **Description:** "Personal site" (anything you like).
4. **Visibility:** Public is fine. (Private also works — both are free.)
5. Leave all the "Initialize this repository with…" checkboxes **unchecked**.
6. Click **Create repository**.

You'll land on a page that says "Quick setup". Leave that page open — we'll use it in a second.

### 1c. Upload the project files

The simplest approach (no command line):

1. On the "Quick setup" page from step 1b, scroll down to the small text link "**uploading an existing file**" and click it.
2. A drag-and-drop area appears. From your unzipped `oliverdvh-site` folder, drag **everything inside it** into that drop zone (not the outer folder — the files and folders inside: `src/`, `.eleventy.js`, `package.json`, `README.md`, `SETUP.md`, `.gitignore`, `package-lock.json`).
   - macOS tip: open the folder, press **Cmd+A** to select everything, then drag.
   - **Do not upload** `node_modules/` if you see it — `.gitignore` should prevent that anyway.
3. Wait for the uploads to finish (the file list at the top will show them all).
4. Below the list, type a commit message like "Initial site" and click **Commit changes**.

Refresh the page. You should now see your code listed at `https://github.com/YOUR-USERNAME/oliverdvh-site`.

### 1d. Update one file with your GitHub username

There's one place in the code that needs your GitHub username inserted:

1. On GitHub, navigate to `src/admin/config.yml`.
2. Click the small **pencil icon** at the top-right of the file view to edit it.
3. On line 3 you'll see: `repo: REPLACE_WITH_GITHUB_USER/oliverdvh-site`.
4. Replace `REPLACE_WITH_GITHUB_USER` with your actual GitHub username, so it reads e.g. `repo: oliverdudokvanheel/oliverdvh-site`.
5. Scroll down, leave the commit message as the default, and click **Commit changes**.

That's GitHub done.

---

## Step 2 — Connect Cloudflare Pages

Cloudflare Pages will build the site from your GitHub repo and serve it for free.

### 2a. Create your Cloudflare account

1. Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. Enter your email, pick a password.
3. Verify your email when Cloudflare sends the link.

### 2b. Create a Pages project

1. In the Cloudflare dashboard left sidebar, expand **Compute (Workers)** then click **Workers & Pages**.
2. Click **Create**, then choose the **Pages** tab, then **Connect to Git**.
3. Click **Connect GitHub**. A GitHub auth popup appears.
   - Choose **Only select repositories** → tick `oliverdvh-site` → **Install & Authorize**.
   - You're now back on Cloudflare.
4. From the repo list, select `oliverdvh-site` and click **Begin setup**.

### 2c. Build settings

Cloudflare asks how to build the site. Use these exact values:

- **Project name:** `oliverdvh-site` (becomes part of a temp URL like `oliverdvh-site.pages.dev`)
- **Production branch:** `main`
- **Framework preset:** **None** (or leave blank)
- **Build command:** `npm run build`
- **Build output directory:** `_site`
- **Root directory:** leave blank

Click **Save and Deploy**.

Cloudflare will spend 1–2 minutes installing Eleventy and building the site. When it's done you'll see a green **Success** banner and a `.pages.dev` URL. Click it — your site is live (just not at oliverdudokvanheel.com yet).

---

## Step 3 — Point your domain at Cloudflare

Right now your domain at Namecheap is still pointing at the old pplx.app site (and getting that error). Time to fix that.

### 3a. Add the custom domain in Cloudflare Pages

1. Back in the Cloudflare Pages project, click the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Type `oliverdudokvanheel.com` and click **Continue**.
4. Cloudflare will say "We can't manage this domain because it's not on Cloudflare DNS." That's fine — choose the option to **continue with external DNS** (sometimes labelled "I'll set up DNS manually").
5. Cloudflare will give you a target — usually something like `oliverdvh-site.pages.dev` or a specific CNAME target. **Copy it.**
6. Repeat for `www.oliverdudokvanheel.com` so both work.

### 3b. Update Namecheap DNS

1. Log in to **Namecheap** → **Domain List** → **Manage** next to `oliverdudokvanheel.com`.
2. Open the **Advanced DNS** tab.
3. **Delete** the two records I had you add yesterday (the ones pointing at `oliverdudokvanheel.pplx.app`).
4. Add a new record:
   - Type: **ALIAS Record** (or CNAME if ALIAS is unavailable)
   - Host: `@`
   - Value: paste the Cloudflare target from step 3a
   - TTL: Automatic
5. Add another:
   - Type: **CNAME Record**
   - Host: `www`
   - Value: same Cloudflare target
   - TTL: Automatic
6. Save (green ticks).

Wait 5–30 minutes. Cloudflare will issue an SSL certificate automatically once DNS resolves. You can refresh the Custom domains tab in Cloudflare Pages to watch it move from "Pending" → "Active".

When **oliverdudokvanheel.com** shows "Active" in Cloudflare, open it in a private/incognito window. You should see your site.

---

## Step 4 — Wire up Decap CMS

Decap is the visual editor at `oliverdudokvanheel.com/admin/`. To let you log in with GitHub, you need to register a tiny "OAuth app" on GitHub.

### 4a. Set up GitHub OAuth via Cloudflare Workers (one-time)

Cloudflare has a hosted OAuth helper specifically for Decap. Easiest path:

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** `Decap CMS — oliverdudokvanheel.com`
   - **Homepage URL:** `https://oliverdudokvanheel.com`
   - **Authorization callback URL:** `https://decap-proxy.yourcloudflare-subdomain.workers.dev/callback`
     *(You'll generate that subdomain in step 4b. For now type a placeholder; you'll come back and update it.)*
3. Click **Register application**.
4. Copy your **Client ID**. Click **Generate a new client secret** and copy that too. Keep both somewhere safe.

### 4b. Deploy the Decap OAuth proxy on Cloudflare Workers

1. In Cloudflare dashboard → **Workers & Pages** → **Create** → **Workers** tab → **Get started** → name it `decap-proxy`.
2. Cloudflare deploys a hello-world worker. Click **Edit code**.
3. Replace the contents with the official Decap GitHub OAuth proxy script: I'll provide this in a follow-up message — it's about 60 lines of JavaScript that handles the GitHub login round-trip. Or use the maintained one at [github.com/decaporg/decap-cms-github-oauth-provider](https://github.com/decaporg/decap-cms-github-oauth-provider).
4. In the worker's **Settings → Variables**, add two environment variables:
   - `OAUTH_CLIENT_ID` = the Client ID from step 4a
   - `OAUTH_CLIENT_SECRET` = the Client Secret from step 4a
5. Save and deploy. Cloudflare gives you a URL like `decap-proxy.YOUR-SUBDOMAIN.workers.dev`.
6. Go back to your GitHub OAuth App (step 4a) and update the **Authorization callback URL** to: `https://decap-proxy.YOUR-SUBDOMAIN.workers.dev/callback`.

### 4c. Tell Decap which OAuth endpoint to use

1. On GitHub, edit `src/admin/config.yml`.
2. Find the `backend:` block at the top. Replace it with:
   ```yaml
   backend:
     name: github
     repo: YOUR-USERNAME/oliverdvh-site
     branch: main
     base_url: https://decap-proxy.YOUR-SUBDOMAIN.workers.dev
   ```
3. Commit the change. Cloudflare Pages will auto-rebuild.

### 4d. Try logging in

1. Go to `https://oliverdudokvanheel.com/admin/`.
2. Click **Login with GitHub**, authorise the app.
3. You should land in the Decap editor, with "Pages" listed in the left sidebar and your home/about/writing/speaking/book/contact entries inside it.

**If you'd rather skip the OAuth Worker step**, there's a simpler but less elegant alternative: use Netlify Identity (free, separate signup). I can switch the config to Netlify's hosted identity service if you'd prefer — let me know.

---

## Step 5 — Make a test edit

1. In Decap, click **Pages → Home page**.
2. Find "Hero (top of page)" → "Intro paragraph". Add a single sentence: "Testing the editor."
3. Click **Publish** (top right) → **Publish now**.
4. Wait ~30 seconds. Open oliverdudokvanheel.com in a private window. The new sentence is there.
5. Edit it back. Publish again. Watch it disappear.

You're done. Welcome to your editable site.

---

## What you can edit, and what to leave alone

**Safe to edit in Decap:**
- Any text on any page (headlines, paragraphs, bullets, button labels, URLs)
- The Substack "fallback posts" lists — these only show if the live feed fails
- Site-wide settings (email address, footer text, nav menu)
- The dropdown options on the contact form

**Don't edit in Decap (or you'll need me to fix it):**
- The hidden "Page template" body field on each page — Decap won't show it by default; if you somehow expose it, leave it alone.
- The `Internal key (don't change)` values in the nav menu — those control which page link gets highlighted in the menu.

**Adding the next Substack post:** you don't need to. The site fetches live from Substack and updates automatically.

**Adding a new page entirely:** that's a code change. Just tell me and I'll add it.

---

## When things go wrong

- **The site shows the old version after I edited.** Hard-refresh your browser (Cmd+Shift+R / Ctrl+F5) or use a private window. Cloudflare and your browser both cache aggressively.
- **A Cloudflare deploy failed.** Open the Pages project → Deployments → click the failed one. Send me the red log lines.
- **The admin page won't load.** The OAuth proxy is probably down or misconfigured. Check the Worker logs in Cloudflare.
- **Decap says "Config error".** You probably edited `src/admin/config.yml` and broke the YAML. Restore from the commit history on GitHub.

You can always ping me; I'll fix anything that breaks.
