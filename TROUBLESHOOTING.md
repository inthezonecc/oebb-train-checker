# Troubleshooting "protocol ' https' is not supported" Error

## The Issue
Home Assistant is seeing a space before 'https' in the URL, causing the error:
```
fatal: protocol ' https' is not supported
```

## Possible Causes

1. **Home Assistant has cached the old repository.json** with a malformed URL
2. **Supervisor cache** needs to be cleared
3. **Repository structure** issue

## Solutions to Try (in order)

### Solution 1: Clear Home Assistant Supervisor Cache

1. **SSH into your Home Assistant machine**
2. **Restart the Supervisor:**
   ```bash
   ha supervisor reload
   ```
3. **Or restart the entire system:**
   - Settings → System → Hardware → Restart

### Solution 2: Manually Clear Repository Cache

1. **SSH into Home Assistant**
2. **Remove cached repository data:**
   ```bash
   # Find and remove cached repository
   rm -rf /data/addons/git/aefa2fbf
   # Or clear all cached repos
   rm -rf /data/addons/git/*
   ```
3. **Reload Supervisor:**
   ```bash
   ha supervisor reload
   ```

### Solution 3: Use Repository YAML Instead

The repository now includes both `repository.json` and `repository.yaml`. Try:

1. Remove the repository from Home Assistant
2. Add it again using the same URL
3. Home Assistant should prefer YAML if available

### Solution 4: Verify Repository Structure

Check that the repository has the correct structure:
```
oebb-train-checker/
├── repository.json          (or repository.yaml)
└── oebb-train-checker/      (matches slug)
    └── config.json
```

### Solution 5: Test Repository URL Manually

Test if the repository URL works:
```bash
git clone https://github.com/inthezonecc/oebb-train-checker
```

If this works, the issue is with Home Assistant's parsing, not the repository.

### Solution 6: Use Raw GitHub URL

Try using the raw GitHub URL format:
```
https://raw.githubusercontent.com/inthezonecc/oebb-train-checker/main/repository.json
```

But this is unconventional - standard is just the GitHub repo URL.

### Solution 7: Check Home Assistant Logs

1. Go to **Settings** → **System** → **Logs**
2. Filter for "repository" or "addon"
3. Look for detailed error messages about the repository parsing

### Solution 8: Local Installation (Bypass Repository)

If repository method keeps failing, install locally:

1. **SSH into Home Assistant**
2. **Clone or copy the repository locally:**
   ```bash
   cd /config/addons
   git clone https://github.com/inthezonecc/oebb-train-checker oebb-train-checker
   ```
3. **Restart Home Assistant** or reload add-ons
4. **Find it in "Local add-ons"**

## Current Repository Status

- ✅ `repository.json` - Compact single-line format, no whitespace
- ✅ `repository.yaml` - Alternative YAML format
- ✅ Directory structure matches slug (`oebb-train-checker/`)
- ✅ Valid JSON/YAML verified

## If Nothing Works

1. **Check Home Assistant version** - Some versions have bugs with repository parsing
2. **Check Supervisor logs** via SSH: `ha supervisor logs`
3. **Try installing directly from the addon directory** using local method
4. **Post on Home Assistant Community** with exact error message

## Alternative: Use HACS (Home Assistant Community Store)

If repository method continues to fail, you could:
1. Convert to a HACS integration (different structure)
2. Or manually install the addon files to `/config/addons/`

