# EnvLens — Zero-Leak Config Transmuter, Linter & Sanitizer

> A 100% offline, zero-dependency, zero-telemetry developer utility that eliminates environment variable friction, secret leakage hazards, and format transmutations.

- **GitHub Repository**: https://github.com/ranajagvinder/envlens
- **Live Utility**: (Enable GitHub Pages in your repo settings to link your live site here)

---

## 🚀 Show HN / Reddit Launch Post Draft

**Title:** Show HN: EnvLens – Offline .env sanitizer, linter, and format transmuter (Zero telemetry)

**Body:**
Hey Hacker News / Reddit,

Like many developers, I got tired of accidentally pasting raw database URIs, AWS keys, or JWT tokens into web-based formatters that run tracking or transmit secrets to third-party servers. 

To solve this, I built **EnvLens**—a completely client-side, zero-dependency web utility that runs 100% offline. 

### What it does:
1. **Bi-Directional Transmutation**: Instantly converts `.env` configurations into JSON, YAML, Docker Compose environment blocks, and Kubernetes Secrets (with base64 encoding toggles).
2. **Template Linter**: Compares your active `.env` against an `.env.example` schema to flag missing required keys or extra undeclared variables.
3. **Smart Secret Sanitizer**: Automatically detects high-entropy tokens (Stripe, AWS, JWTs, DB passwords) and replaces them with clean masks before you share configs in issues or Discord.
4. **Absolute Privacy**: Zero external CDN requests, zero telemetry, and available as a portable 32 KB standalone HTML file.

Check out the code or run it locally:
👉 **GitHub:** https://github.com/ranajagvinder/envlens

Feedback, feature requests, or contributions are welcome!
