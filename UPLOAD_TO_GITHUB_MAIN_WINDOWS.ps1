# Upload all website source directly to GitHub MAIN. No staging branch.
$ErrorActionPreference = 'Stop'
$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$check = Join-Path $source 'scripts\check_site.py'
if (-not (Test-Path $check)) { throw 'Missing scripts/check_site.py. Extract the whole ZIP first.' }
Write-Host 'Running local website source checks...'
& python $check
if ($LASTEXITCODE -ne 0) { throw 'Website checks failed. Upload aborted.' }
$target = Join-Path $env:TEMP ('seooutsourcingph-main-' + [DateTime]::UtcNow.ToString('yyyyMMddHHmmss'))
& git clone 'https://github.com/erwinmehehe/seooutsourcingph.git' $target
if ($LASTEXITCODE -ne 0) { throw 'Git clone failed. Install and sign in to GitHub via Git.' }
Push-Location $target
try {
    & git checkout main
    if ($LASTEXITCODE -ne 0) { throw 'Could not check out the main branch.' }
    foreach ($folder in @('standalone', 'wordpress', 'quality', 'scripts', '.github')) {
        $from = Join-Path $source $folder
        if (-not (Test-Path $from)) { throw "Missing required folder: $folder" }
        Copy-Item -Path $from -Destination $target -Recurse -Force
    }
    foreach ($file in @('README.md', 'DEPLOYMENT.md', 'IMPORT_TO_GITHUB.md', '.gitignore', 'START_HERE.md', 'AUSTRALIA_INDUSTRY_HANDOFF.md', 'IMPORT_REPORT.json')) {
        $from = Join-Path $source $file
        if (Test-Path $from) { Copy-Item -Path $from -Destination $target -Force }
    }
    & git add standalone wordpress quality scripts .github README.md DEPLOYMENT.md IMPORT_TO_GITHUB.md .gitignore START_HERE.md AUSTRALIA_INDUSTRY_HANDOFF.md IMPORT_REPORT.json
    if ($LASTEXITCODE -ne 0) { throw 'Git add failed.' }
    & git diff --cached --check
    if ($LASTEXITCODE -ne 0) { throw 'Invalid patch/whitespace found.' }
    Write-Host 'Files about to be committed:'
    & git diff --cached --stat
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { Write-Host 'Already up to date.'; return }
    & git commit -m 'feat: add Australia-expanded 60-page SEO outsourcing website'
    if ($LASTEXITCODE -ne 0) { throw 'Git commit failed. Check your configured Git user.' }
    & git push origin main
    if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Check credentials and branch permissions.' }
    Write-Host 'Done: pushed full website source to origin/main. Live site not changed by this script.'
} finally { Pop-Location }
