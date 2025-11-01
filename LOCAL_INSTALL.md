# Local Installation Method (Workaround for Repository Error)

Since Home Assistant Supervisor seems to have issues parsing the repository URL, use this local installation method as a workaround.

## Step 1: SSH into Home Assistant

```bash
# SSH into your Home Assistant machine
ssh root@<your-home-assistant-ip>
# Or use Home Assistant Terminal add-on
```

## Step 2: Clone Repository Locally

```bash
cd /config/addons
git clone https://github.com/inthezonecc/oebb-train-checker oebb-train-checker
```

## Step 3: Verify Structure

```bash
ls -la /config/addons/oebb-train-checker/
# Should see: oebb-train-checker/ directory with config.json inside
```

## Step 4: Install via Home Assistant UI

1. Go to **Settings** → **Add-ons** → **Add-on Store**
2. Click **"Check for updates"** or refresh
3. Find **"ÖBB Train Checker"** under **"Local add-ons"**
4. Click **"Install"**
5. Configure the add-on (stations, time, port)
6. Click **"Start"**

## Step 5: Verify Installation

1. Check the **Log** tab - should see:
   ```
   🚂 Train checker API server started!
   Server running on http://localhost:3000
   ```

2. Test the API:
   ```bash
   curl http://localhost:3000/health
   ```

## Alternative: Manual File Copy

If git clone doesn't work either:

1. **Download the repository as ZIP** from GitHub
2. **Extract it**
3. **Copy the `oebb-train-checker` directory** to `/config/addons/`
4. **Follow Step 4 above**

This bypasses the repository parsing issue completely.

