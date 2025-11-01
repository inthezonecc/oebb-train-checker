# Preparing to Push to GitHub

## Before Pushing - Update These Files

You'll need to replace placeholder URLs with your actual GitHub username and repository name:

### Files to Update:

1. **`repository.json`** - Line 3
   - Replace: `https://github.com/yourusername/oebb-train-checker`
   - With: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

2. **`addon/config.json`** - Lines 6 and 30
   - Line 6: Replace `https://github.com/yourusername/oebb-train-checker`
   - Line 30: Replace `ghcr.io/yourusername/oebb-train-checker`
   - With: Your actual GitHub username and repository name

3. **`.github/workflows/build.yml`** (if it exists)
   - Check that it references the correct repository

## Steps to Push:

```bash
# 1. Initialize git repository
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Initial commit: ÖBB Train Checker Home Assistant add-on"

# 4. Create repository on GitHub (via web UI)
# Go to: https://github.com/new
# Repository name: oebb-train-checker (or your preferred name)
# Description: Home Assistant add-on for monitoring ÖBB train schedules
# Choose Public or Private

# 5. Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## After Pushing:

1. **Enable GitHub Actions** (if using CI/CD)
   - Go to repository → Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

2. **Update image URLs** after first build completes
   - Go to repository → Packages
   - Find your container image
   - Update `addon/config.json` line 30 with the correct image path

3. **Share repository URL** for installation:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
   ```

## Repository Structure:

```
oebb-train-checker/
├── .gitignore
├── .github/
│   └── workflows/
│       └── build.yml          # CI/CD for building
├── addon/
│   ├── config.json            # Add-on configuration (update URLs)
│   ├── Dockerfile
│   ├── build.yaml
│   ├── run.sh
│   ├── oebb.js
│   └── package.json
├── repository.json             # Repository manifest (update URL)
├── README.md
├── home-assistant-config.yaml
└── PUBLISHING.md
```

## Quick Update Script:

You can quickly update all placeholders with:
```bash
# Replace YOUR_USERNAME and YOUR_REPO_NAME
find . -type f -name "*.json" -o -name "*.md" -o -name "*.yml" | \
  xargs sed -i '' 's/yourusername/YOUR_USERNAME/g'
find . -type f -name "*.json" -o -name "*.md" -o -name "*.yml" | \
  xargs sed -i '' 's/oebb-train-checker/YOUR_REPO_NAME/g'
```

Or manually update the files listed above.

