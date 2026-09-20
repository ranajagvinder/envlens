# EnvLens — Zero-Leak Config Transmuter, Linter & Sanitizer

> A 100% offline, zero-dependency, zero-telemetry developer utility that eliminates environment variable friction, secret leakage hazards, and format transmutations.

- **GitHub Repository**: [https://github.com/ranajagvinder/envlens](https://github.com/ranajagvinder/envlens)
- **Live Utility**: [https://ranajagvinder.github.io/envlens/](https://ranajagvinder.github.io/envlens/)

---

## ⚡ Key Features

1. **Bi-Directional Format Transmutation**:
   - Instantly converts configs between `.env`, `JSON`, `YAML`, `Docker Compose` (`environment:`), and `Kubernetes Secrets` (`stringData:`).
2. **Auto-Sanitizer Shield**:
   - Automatically detects and redacts high-entropy keys, database passwords (`postgres://...`), JWT tokens, AWS credentials, Vault tokens, and Stripe keys with safe `<REDACTED_...>` placeholders before sharing.
3. **Template Linter & Schema Reconciliation**:
   - Compares active `.env` files against `.env.example` templates to identify missing required keys or orphaned extra variables.
4. **100% Client-Side Privacy**:
   - Zero external CDNs, zero analytics, zero cookies, zero network calls.
5. **Ultra-Portable Single-File Bundle**:
   - Packaged into a self-contained ~32 KB HTML file (`index.html` / `envlens-standalone.html`) that runs entirely offline in any modern browser.

---

## 🚀 Quick Start

### Run Offline / Locally
```bash
# Clone the repository
git clone https://github.com/ranajagvinder/envlens.git
cd envlens

# Open directly or run a local lightweight server
python -m http.server 8080
```
Open `http://localhost:8080` or double-click `envlens-standalone.html` in your file explorer.

### Rebuilding the Standalone Bundle
If you modify source files (`index.source.html`, `style.css`, or `app.js`), regenerate the self-contained bundle with:
```bash
python bundle.py
```

---

## 🛠️ Zero-Cost Deployment

EnvLens requires no build step or backend servers and can be hosted for free on any static provider:

- **GitHub Pages**: Set Source to `Deploy from a branch` (`main` / root).
- **Cloudflare Pages**: Run `npx wrangler pages deploy . --project-name=envlens`.
- **Vercel**: Run `npx vercel --prod`.
- **Netlify**: Drag-and-drop the directory to [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 📢 Community Launch Copy

### Show HN / Reddit Launch Post Draft

**Title:** `Show HN: EnvLens – Offline .env sanitizer, linter, and format transmuter (Zero telemetry)`

**Body:**
> Hey Hacker News / Reddit,
> 
> Like many developers, I got tired of accidentally pasting raw database URIs, AWS keys, or JWT tokens into web-based formatters that run tracking or transmit secrets to third-party servers. 
> 
> To solve this, I built **EnvLens**—a completely client-side, zero-dependency web utility that runs 100% offline. 
> 
> **What it does:**
> 1. **Bi-Directional Transmutation**: Instantly converts `.env` configurations into JSON, YAML, Docker Compose environment blocks, and Kubernetes Secrets.
> 2. **Template Linter**: Compares your active `.env` against an `.env.example` schema to flag missing required keys or extra undeclared variables.
> 3. **Smart Secret Sanitizer**: Automatically detects high-entropy tokens (Stripe, AWS, JWTs, DB passwords) and replaces them with clean masks before you share configs in issues or Discord.
> 4. **Absolute Privacy**: Zero external CDN requests, zero telemetry, and available as a portable 32 KB standalone HTML file.
> 
> Check out the code or run it locally:
> 👉 **GitHub:** https://github.com/ranajagvinder/envlens  
> 👉 **Live Demo:** https://ranajagvinder.github.io/envlens/
> 
> Feedback, feature requests, or contributions are welcome!

---

## 📄 License
MIT License. Free for personal, open-source, and commercial engineering workflows.
