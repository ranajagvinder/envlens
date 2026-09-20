import os
import shutil

# Resolve base_dir dynamically relative to script location
base_dir = os.path.dirname(os.path.abspath(__file__))

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

standalone_path = os.path.join(base_dir, "envlens-standalone.html")
with open(standalone_path, "w", encoding="utf-8") as f:
    f.write(html_bundled)

# Also update root index.html for zero-config static hosting
index_path = os.path.join(base_dir, "index.html")
shutil.copyfile(standalone_path, index_path)

print(f"Bundled successfully:")
print(f" - {standalone_path} ({len(html_bundled)} bytes)")
print(f" - {index_path} ({len(html_bundled)} bytes)")
