# oliverdudokvanheel.com

Personal site for Oliver Dudok van Heel — writer and sustainability strategist.

## Stack

- **Eleventy** (11ty) — static-site generator
- **Decap CMS** at `/admin/` — browser-based content editor
- **Cloudflare Pages** — hosting + auto-deploy on Git push
- **GitHub** — source of truth

## Editing the site

The easy way: go to **https://oliverdudokvanheel.com/admin/**, log in with GitHub, pick a page, make your changes, click Publish. Cloudflare Pages will rebuild the site automatically (~30 seconds).

The nerdy way:

```bash
npm install
npm start          # runs at http://localhost:8080 with live reload
```

Edit anything under `src/`, then commit + push. Cloudflare Pages deploys on push.

## Project layout

```
src/
  _data/site.json        ← site-wide settings (email, footer, nav)
  _includes/             ← base layout, header, footer
  admin/                 ← Decap CMS (config.yml + entry HTML)
  assets/                ← styles, JS, images, PDFs
  index.njk              ← Home page (content + template)
  about.njk
  writing.njk
  speaking.njk
  book.njk
  contact.njk
.eleventy.js             ← build config
```

See `SETUP.md` for first-time deployment instructions.
