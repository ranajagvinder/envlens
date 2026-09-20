# EnvLens Developer Community Launch Copy & Positioning Kit

This kit provides ready-to-publish launch copy tailored to the culture and tone of **Hacker News (Show HN)**, **Reddit (r/webdev, r/programming)**, and **Dev.to / Hashnode / X**.

---

## 1. Hacker News (Show HN)

### Post Title
```
Show HN: EnvLens – 100% client-side, zero-telemetry .env sanitizer and format transmuter
```

### Post Body
```markdown
Hey HN,

A recurring headache I ran into when dealing with microservices, Docker compose files, Kubernetes configs, and GitHub issues was handling environment variables safely:

1. Translating between formats: `.env` ⇄ JSON ⇄ YAML ⇄ Docker Compose `environment:` ⇄ Kubernetes Secrets (`stringData:`).
2. Secret leakage anxiety: pasting configs into online formatters that send payloads to remote servers or analytics tools.
3. Schema drift: trying to find which keys are in `.env.example` but missing from production `.env`.

I built **EnvLens**: a lightweight, single-file web utility designed to run 100% offline and in-browser with zero telemetry, zero CDN dependencies, and zero third-party scripts.

### What it does:
- **Instant Bi-Directional Transmutation**: Converts between `.env`, `JSON`, `YAML`, `Docker Compose`, and `Kubernetes Secrets`.
- **Auto-Sanitizer Shield**: Automatically identifies and replaces high-entropy secrets, database URIs (`postgres://user:pass@host`), JWT tokens, AWS keys, Stripe secret keys, and Vault tokens with `<REDACTED_...>` placeholders before sharing.
- **Template Linter**: Compares your active config against your `.env.example` to highlight missing variables or undeclared extra keys.
- **Zero-Dependency Single-File Bundle**: Can be run from a single 32 KB self-contained HTML file (offline / air-gapped).

Source and standalone bundle: https://github.com/<username>/envlens
Live demo: https://<username>.github.io/envlens/

Feedback, regex edge cases, and feature suggestions are very welcome!
```

---

## 2. Reddit (r/webdev, r/programming, r/DevOps)

### Post Title
```
I got tired of accidental secret leaks, so I built EnvLens: a 100% offline .env sanitizer and format converter (Zero dependencies, runs as a single 32KB HTML file)
```

### Post Body
```markdown
Ever had that moment of panic where you wanted to paste your config into a Discord chat, GitHub issue, or format converter, and almost leaked a database password or AWS secret key? Or spent 10 minutes turning a `.env` into Kubernetes `stringData` or Docker Compose YAML?

Most online converters ping third-party analytics, logs, or external servers. For configs and secrets, that’s an immediate no-go.

So I created **EnvLens** — a fast, private developer utility:

### Highlights:
- 🛡️ **Auto-Redacts Secrets**: Masks database URIs, JWTs, AWS credentials, and API keys automatically.
- ⚡ **Multi-Format Transmutation**: One-click conversion between `.env`, JSON, YAML, Docker Compose, and Kubernetes Secrets.
- 🔍 **Schema Diffing**: Paste your `.env.example` to instantly see what required variables are missing or unpopulated.
- 📴 **100% Offline & Pure Vanilla**: Zero external CDN fonts, zero analytics, zero external network calls. You can save `envlens-standalone.html` to your desktop and use it without internet.

It's free, open source, and deployable to GitHub Pages or Cloudflare Pages with zero build step.

- Repo & Single-File Download: https://github.com/<username>/envlens
- Live Web Tool: https://<username>.github.io/envlens/

Would love to know what formats or secret patterns you'd like added!
```

---

## 3. Dev.to / Hashnode / Technical Blog

### Post Title
```
Stop Pasting Secrets into Cloud Formatters: Introducing EnvLens (An Offline .env Transmuter & Linter)
```

### Cover Tagline
*A zero-telemetry, client-side utility to sanitize credentials, reconcile .env.example schemas, and convert configs to Docker & Kubernetes.*

### Tags
`#webdev #devops #security #opensource`

### Article Content
```markdown
Environment variables are the bedrock of the 12-factor app pattern, but in day-to-day development, they are often a source of friction:

- **Format mismatch**: Docker Compose expects YAML list syntax, Kubernetes expects ConfigMap or Secret manifests, and your node script expects JSON or `.env`.
- **Secret exposure**: Pasting connection strings into cloud converters exposes production credentials to access logs and network snoopers.
- **Missing keys**: Deploying a container only to discover at runtime that 2 new variables from `.env.example` were never populated.

### Enter EnvLens
**EnvLens** was engineered to solve these bottlenecks with strict privacy guarantees:

1. **Zero External Requests**: Built in pure vanilla JavaScript and system CSS. Not a single request leaves your browser (not even fonts).
2. **Deterministic Transmutation**: Instant switching between `.env`, `JSON`, `YAML`, `Docker Compose`, and `Kubernetes Secret` formats with key sorting and quote escaping.
3. **Smart Heuristic Redaction**: Detects `postgres://`, `mongodb://`, `AKIA...`, `sk_live_...`, Bearer JWTs, and token fields, replacing them with safe masks.
4. **Visual Schema Diff**: Pinpoints missing and undeclared variables in real time.
5. **Portable Single-File Bundle**: Packaged into a single ~32 KB HTML file that can be kept on an air-gapped machine or developer desktop.

Check out the code, run it locally, or deploy it to your own static hosting in seconds:
- **GitHub**: https://github.com/<username>/envlens
- **Live Version**: https://<username>.github.io/envlens/
```

---

## 4. X / Twitter / Bluesky Social Launch Thread

```text
🚀 Introducing EnvLens — a 100% private, client-side developer utility for your environment configs.

⚡ Convert .env ⇄ JSON ⇄ YAML ⇄ Docker Compose ⇄ Kubernetes Secrets
🛡️ Auto-sanitize database URLs, AWS keys & JWTs
🔍 Catch missing keys vs .env.example
📴 Zero CDNs, zero telemetry, runs in 1 standalone HTML file

Try it live: https://<username>.github.io/envlens/
Open Source: https://github.com/<username>/envlens
```
