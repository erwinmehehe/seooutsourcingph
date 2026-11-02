# Direct upload to GitHub main

Repository: https://github.com/erwinmehehe/seooutsourcingph

**No staging branch.** Everything is imported directly to `main`.

1. Download the updated `SEO_Outsourcing_Philippines_Direct_Main_GitHub_60_Pages.zip` in this conversation.
2. Extract the archive completely. Do not upload the ZIP file to GitHub expecting it to unpack itself.
3. Install Git, and authenticate to GitHub using Git Credential Manager / GitHub CLI.
4. Run one of the following commands from the extracted archive root:

**Windows PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File .\UPLOAD_TO_GITHUB_MAIN_WINDOWS.ps1
```

**macOS/Linux:**
```bash
bash ./UPLOAD_TO_GITHUB_MAIN_MAC_LINUX.sh
```

The script validates 60 pages and WordPress drafts, clones the repo, copies files, runs a staged diff check, commits and **pushes to main**. No forced push, no automatic production deployment.

5. Verify `standalone/`, `wordpress/`, `quality/`, and `scripts/` appear in the repo. Check the GitHub Action titled **Website source QA**.

Do not commit private secrets, contact leads, private reports or production .env files. Live domain and indexing decisions are separate from GitHub upload.
