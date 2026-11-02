# Import the 60-page staging build into this repository

The latest Australia-expanded website package was prepared in the ChatGPT conversation as:

**SEO_Outsourcing_Philippines_GitHub_Ready.zip**

The repository currently contains only the safety scaffold, not the full website source.

## Windows PowerShell

1. Download and extract the Git-ready ZIP on your computer.
2. Open a PowerShell window and run:

```powershell
git clone https://github.com/erwinmehehe/seooutsourcingph.git
cd seooutsourcingph
git checkout staging/site-import
# Change the path below to the folder where you extracted the ZIP.
Copy-Item -Path "C:\Users\YOURNAME\Downloads\SEO_Outsourcing_Philippines_GitHub_Ready\*" -Destination . -Recurse -Force
git add standalone wordpress quality README.md DEPLOYMENT.md IMPORT_TO_GITHUB.md .gitignore
git commit -m "feat: import Australia-expanded 60-page staging website"
git push origin staging/site-import
```

## Mac/Linux

```bash
git clone https://github.com/erwinmehehe/seooutsourcingph.git
cd seooutsourcingph
git checkout staging/site-import
cp -R /path/to/extracted/SEO_Outsourcing_Philippines_GitHub_Ready/. ./
git add standalone wordpress quality README.md DEPLOYMENT.md IMPORT_TO_GITHUB.md .gitignore
git commit -m "feat: import Australia-expanded 60-page staging website"
git push origin staging/site-import
```

GitHub Actions will then validate page count, titles, H1s, canonical tags, and internal links. Review its results and the open launch checklist before approving a merge.

**Important:** This is a public repository. Do not commit credentials, customer records, or private client evidence. Importing the site does **not** deploy it or remove staging `noindex`.
