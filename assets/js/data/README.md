# JeevSetu

Simple multi-page static site for managing domestic animals and milk production.

## How to run locally
1. Clone repo
2. Serve files with any static server:
   - Python: `python3 -m http.server 8000`
   - Or open `index.html` in browser (recommended to use a local server for fetch/localStorage)
3. Visit `http://localhost:8000`

## Deploy
You can host as GitHub Pages (Settings → Pages → branch: main / gh-pages).

Data is stored in browser `localStorage`. For production use, add a backend (see optional `server/`).
