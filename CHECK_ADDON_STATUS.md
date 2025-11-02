# Checking Add-on Status - REST Platform Error

## The Error

```
Platform rest not ready yet: Server disconnected; Retrying in background in 30 seconds
```

This error means the REST sensors are trying to connect to `http://localhost:3000` but can't reach the add-on API.

## What This Means

- ✅ REST platform IS loading
- ✅ Sensors ARE being configured
- ❌ Can't connect to add-on API (expected if add-on isn't running)
- ❓ Sensors should still appear as "unavailable" but might not be created yet

## Step 1: Check Add-on Status

1. **Go to Settings → Add-ons → ÖBB Train Checker**
2. **Check if it says "Running" or "Stopped"**
3. **If Stopped:**
   - Click **"Start"** button
   - Wait for it to start
   - Check the **Log** tab for errors

## Step 2: Check Add-on Logs

1. **Go to Settings → Add-ons → ÖBB Train Checker**
2. **Click the "Log" tab**
3. **Look for:**
   - `🚂 Train checker API server started!`
   - `Server running on http://localhost:3000`
   - Or any error messages

## Step 3: Test API Manually

If add-on is running, test the API:

1. **SSH into Home Assistant** or use **Terminal add-on**
2. **Run:** `curl http://localhost:3000/health`
3. **Should return:** `{"status":"ok"}` or similar

**If this works:** API is running, sensors should connect
**If this fails:** Add-on isn't responding, check logs

## Step 4: Wait and Check Again

The error says "Retrying in background in 30 seconds":

1. **Wait 30-60 seconds** after restart
2. **Go to Developer Tools → States**
3. **Search for `oebb`** again
4. **Sensors might appear after retry**

## Step 5: Check All Logs

1. **Go to Settings → System → Logs**
2. **Search for `rest`** or `sensor`
3. **Look for any errors** preventing sensors from being created

## Step 6: Verify Add-on is Running

The most common issue is the add-on not running:

1. **Settings → Add-ons → ÖBB Train Checker**
2. **Should show "Running" status** (green)
3. **If "Stopped" (red):**
   - Click **"Start"**
   - Wait for logs to show it started
   - Check logs for errors

## Step 7: If Add-on Won't Start

If add-on is stopped and won't start:

1. **Check the Log tab** for errors
2. **Check Configuration tab** - make sure settings are correct
3. **Try uninstalling and reinstalling** the add-on

## Expected Behavior

Once add-on is running:
- ✅ API responds at `http://localhost:3000/health`
- ✅ REST sensors connect successfully
- ✅ Sensors appear in **Developer Tools → States**
- ✅ Sensors show actual data (not "unavailable")

## Next Steps

1. **Check if add-on is running**
2. **If not running, start it**
3. **Wait 30-60 seconds** for retry
4. **Check Developer Tools → States** again for `oebb` sensors

Once the add-on is running and API is accessible, the REST platform will retry and sensors should appear!

