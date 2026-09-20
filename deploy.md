# EnvLens Deployment & Distribution Guide

EnvLens is a 100% offline, zero-dependency, zero-telemetry developer utility. It requires no backend server, database, or API keys.

---

## 1. Automated Single-File Distribution Bundle

For maximum portability (offline USB sticks, internal air-gapped environments, browser bookmarks, or single-file sharing), EnvLens can run completely standalone from a single `.html` file.

### Pre-generated Bundle
- **Location**: [`envlens-standalone.html`](file:///C:/Users/Rana/.gemini/antigravity-ide/scratch/envlens/envlens-standalone.html) (~32 KB)
- **Direct Usage**: Double-click `envlens-standalone.html` in Windows Explorer or open it in any modern browser without a web server.

### Rebuilding the Bundle
To regenerate the single-file distribution after editing `style.css` or `app.js`:
```bash
python bundle.py
```

---

## 2. GitHub Pages Deployment (One-Click / Automated Workflow)

### Method A: Automated GitHub Actions Workflow (Zero-Maintenance)
Add the following file at `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy EnvLens to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Method B: Native GitHub Pages Branch Deploy
1. Push this directory to your GitHub repo.
2. In GitHub, go to **Settings** > **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`.
5. Click **Save**. The app goes live at `https://<username>.github.io/<repo-name>/`.

---

## 3. Cloudflare Pages Deployment (Ultra-Fast Global Edge)

### Method A: Git Integration
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set build configurations:
   - **Framework preset**: None
   - **Build command**: *(leave empty)*
   - **Build output directory**: `.`
5. Click **Save and Deploy**.

### Method B: Cloudflare Wrangler CLI (Direct Command Line Deploy)
Run from the `scratch/envlens` directory:
```bash
npx wrangler pages deploy . --project-name=envlens
```

---

## 4. Vercel & Netlify Deployment

- **Vercel**:
  ```bash
  npx vercel --prod
  ```
- **Netlify**:
  - Drag-and-drop the entire directory to [app.netlify.com/drop](https://app.netlify.com/drop).
  - Or via CLI:
    ```bash
    npx netlify deploy --prod --dir=.
    ```

---

## 5. Instant Local Server
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```
Open [http://localhost:8080](http://localhost:8080) in your browser.
