# Fix Supervisor Cache Issue - "protocol ' https' is not supported"

The repository.json file is **100% clean** with no spaces. The issue is Supervisor's cache.

## Aggressive Cache Clear (SSH Required)

### Step 1: SSH into Home Assistant

```bash
# SSH into your Home Assistant
ssh root@<your-ha-ip>
# Or use Terminal add-on
```

### Step 2: Clear ALL Supervisor Cache

```bash
# Remove the specific cached repository
rm -rf /data/addons/git/aefa2fbf

# Clear ALL cached repositories (if safe to do so)
rm -rf /data/addons/git/*

# Clear Supervisor store cache
rm -rf /data/supervisor/store/*

# Restart Supervisor completely
ha supervisor reload
```

### Step 3: Wait 30 seconds

Give Supervisor time to fully restart.

### Step 4: Re-add Repository in UI

1. **Settings** → **Add-ons** → **Add-on Store**
2. **⋮** → **Repositories** → **Add**
3. Enter: `https://github.com/inthezonecc/oebb-train-checker`
4. **Add**

## Verify Supervisor is Reading Correct File

After re-adding, check Supervisor logs:

```bash
ha supervisor logs | grep -i "repository\|oebb" | tail -20
```

Or check what file Supervisor actually read:

```bash
cat /data/addons/git/*/repository.json 2>/dev/null | grep url
```

This should show the URL with NO spaces before https.

## If Still Failing

This might be a **Supervisor bug**. Check:

1. **Supervisor version**: `ha supervisor info`
2. **Update Supervisor**: `ha supervisor update`
3. **Check Home Assistant version**: Update to latest

The repository.json file is verified clean - this is a Supervisor caching/parsing issue.

