# Upload the website directly to GitHub main

Repository: https://github.com/erwinmehehe/seooutsourcingph

Branch: **`main`**. No staging branch, no pull request required.

**Extract the ZIP completely before running the uploader.** GitHub does not unpack ZIPs merely because they are committed as files.

## Windows

1. Download and extract this archive to a folder, preserving its files and folders.
2. Ensure Git is installed and authenticated for GitHub. You must have write access to the repository.
3. Right-click `UPLOAD_TO_GITHUB_MAIN_WINDOWS.ps1` and run with PowerShell, or open PowerShell in the extracted folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\UPLOAD_TO_GITHUB_MAIN_WINDOWS.ps1
```

The script checks the site, clones the repository, copies the source files, shows what will be committed and pushes to `origin/main`. It does not change your website DNS or hosting.

## macOS/Linux

```bash
bash ./UPLOAD_TO_GITHUB_MAIN_MAC_LINUX.sh
```

The script creates a temporary local clone and pushes to `main`.

## Verify your GitHub upload

- Open the repository and confirm that `standalone/`, `wordpress/`, `quality/` and `scripts/` are present.
- Check GitHub Actions: `Website source QA` should pass for the new commit.
- Confirm no `.env`, database, leads, or confidential records were committed.

This is a source-code import, **not a live production deployment**. The site intentionally retains publication approvals and `noindex` until signed off.
