# Rebuild Add-on to Fix Service Not Running

## The Problem

Service starts but no `[SERVICE]` messages or Node.js output appear. This means the service script isn't executing.

## Solution: Rebuild Add-on

1. **Stop the add-on:**
   - Go to **Settings → Add-ons → ÖBB Train Checker**
   - Click **"Stop"** button

2. **Rebuild the add-on:**
   - Click **"Rebuild"** button
   - Wait for rebuild to complete (this will rebuild with the updated Dockerfile)

3. **Update Configuration:**
   - Click **"Configuration"** tab
   - Verify `port: 3535` is set
   - Click **"Save"**

4. **Start the add-on:**
   - Click **"Start"** button
   - Wait for it to start

5. **Check Logs:**
   - Click **"Log"** tab
   - You should now see:
     ```
     [SERVICE] ========================================
     [SERVICE] Starting ÖBB Train Checker service...
     [SERVICE] Working directory: /app
     [SERVICE] Node version: v...
     [SERVICE] Environment variables:
     [SERVICE]   PORT=3535
     [SERVICE] Starting Node.js application...
     🚂 Train checker API server started!
     Server running on http://localhost:3535
     ```

## If Rebuild Doesn't Help

If you still don't see `[SERVICE]` messages after rebuild:

1. **Uninstall the add-on:**
   - Click **"Uninstall"** button
   - Wait for uninstall to complete

2. **Reinstall:**
   - Click **"Install"** button
   - Wait for installation to complete
   - Configure with `port: 3535`
   - Start the add-on

3. **Check logs again**

## Next Steps

After rebuild, check the Log tab for:
- ✅ `[SERVICE]` messages
- ✅ `🚂 Train checker API server started!`
- ✅ `Server running on http://localhost:3535`

Once you see these messages, the service is running and you can test:
```bash
curl http://localhost:3535/health
```

