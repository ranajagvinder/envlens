import os

base_dir = r"C:\Users\Rana\.gemini\antigravity-ide\scratch\envlens"
with open(os.path.join(base_dir, "index.source.html"), "r", encoding="utf-8") as f:
    html = f.read()

with open(os.path.join(base_dir, "style.css"), "r", encoding="utf-8") as f:
    css = f.read()

with open(os.path.join(base_dir, "app.js"), "r", encoding="utf-8") as f:
    js = f.read()

# Inline CSS
html_bundled = html.replace('<link rel="stylesheet" href="style.css">', f"<style>\n{css}\n</style>")

# Inline JS
html_bundled = html_bundled.replace('<script src="app.js"></script>', f"<script>\n{js}\n</script>")

out_path = os.path.join(base_dir, "envlens-standalone.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html_bundled)

print(f"Generated standalone single-file bundle at: {out_path} ({len(html_bundled)} bytes)")
