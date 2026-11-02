#!/usr/bin/env bash
set -euo pipefail
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$source_dir/scripts/check_site.py"
target="$(mktemp -d)"
trap 'rm -rf "$target"' EXIT
git clone https://github.com/erwinmehehe/seooutsourcingph.git "$target/repo"
cd "$target/repo"
git checkout main
for folder in standalone wordpress quality scripts .github; do
  cp -R "$source_dir/$folder" ./
done
for file in README.md DEPLOYMENT.md IMPORT_TO_GITHUB.md .gitignore START_HERE.md AUSTRALIA_INDUSTRY_HANDOFF.md IMPORT_REPORT.json; do
  if [ -f "$source_dir/$file" ]; then cp "$source_dir/$file" ./; fi
done
git add standalone wordpress quality scripts .github README.md DEPLOYMENT.md IMPORT_TO_GITHUB.md .gitignore START_HERE.md AUSTRALIA_INDUSTRY_HANDOFF.md IMPORT_REPORT.json
git diff --cached --check
git diff --cached --stat
if git diff --cached --quiet; then
  echo "Already up to date"
  exit 0
fi
git commit -m 'feat: add Australia-expanded 60-page SEO outsourcing website'
git push origin main
echo 'Website source pushed to main. This did not change the live domain.'
