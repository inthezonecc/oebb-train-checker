# Check Add-on Logs - Connection Reset Error

## The Error

```
curl: (56) Recv failure: Connection reset by peer
```

This means:
- ✅ Connection to port 3535 is being attempted
- ❌ Service is crashing or not starting properly
- ❌ Node.js application might not be running

## Step 1: Check Add-on Logs

1. **Go to Settings → Add-ons → ÖBB Train Checker**
2. **Click the "Log" tab**
3. **Look for:**
   - `[SERVICE] Starting ÖBB Train Checker service...`
   - `[SERVICE] Node version: ...`
   - `🚂 Train checker API server started!`
   - Any error messages

## Step 2: What to Look For

### ✅ Good Signs:
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

### ❌ Bad Signs:
- No `[SERVICE]` messages = Service script not running
- No `🚂 Train checker API server started!` = Node.js app not starting
- Error messages = Something is wrong

## Step 3: Common Issues

### Issue 1: Service Not Starting

If you don't see `[SERVICE] Starting ÖBB Train Checker service...`:
- Service script isn't executing
- Check if Dockerfile was built correctly
- Rebuild the add-on

### Issue 2: Node.js Errors

If you see Node.js errors:
- Check `oebb.js` for syntax errors
- Verify dependencies are installed
- Check if Node.js version is compatible

### Issue 3: Port Already in Use

If port 3535 is already in use:
- Change to a different port
- Or stop the service using port 3535

### Issue 4: Environment Variables Not Set

If you see `PORT=undefined` or similar:
- Check add-on configuration
- Verify `port: 3535` is set correctly
- Restart the add-on

## Step 4: Check Add-on Status

1. **Go to Settings → Add-ons → ÖBB Train Checker**
2. **Info tab:**
   - Should show "Running" (green)
   - If "Stopped" (red), click "Start"
3. **Check CPU/RAM usage:**
   - Should show some activity
   - If 0%, service might not be running

## Step 5: Rebuild Add-on

If service isn't starting:

1. **Stop the add-on**
2. **Click "Rebuild"** button
3. **Wait for rebuild to complete**
4. **Start the add-on again**
5. **Check logs**

## Step 6: Test from Inside Container

If possible, test from inside the add-on:

1. **SSH into Home Assistant**
2. **Get container ID:**
   ```bash
   docker ps | grep oebb
   ```
3. **Enter container:**
   ```bash
   docker exec -it <container-id> sh
   ```
4. **Check if service is running:**
   ```bash
   ps aux | grep node
   ```
5. **Check if port is listening:**
   ```bash
   netstat -tuln | grep 3535
   ```

## Next Steps

After checking logs, share:
1. **What you see in the Log tab**
2. **Any error messages**
3. **Whether you see `[SERVICE]` messages**
4. **Whether you see `🚂 Train checker API server started!`**

This will help identify the exact issue!

