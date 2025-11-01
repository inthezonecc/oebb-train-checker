# Installation Guide - ÖBB Train Checker Home Assistant Add-on

## Quick Start (Local Development)

### Step 1: Copy Add-on to Home Assistant

1. Copy the `addon` directory to your Home Assistant add-ons folder:
   ```bash
   # On Home Assistant OS or Supervised installation:
   cp -r addon /config/addons/oebb-train-checker
   ```

2. Or if using SSH:
   ```bash
   # SSH into your Home Assistant machine
   # Then copy the addon directory to /config/addons/oebb-train-checker
   ```

### Step 2: Install via Home Assistant UI

1. Go to **Settings** → **Add-ons** → **Add-on Store**
2. If you see **"Local add-ons"**, click **"Check for updates"** or **"Reload"**
3. You should see **"ÖBB Train Checker"** appear in the list
4. Click on it and click **"Install"**
5. Configure the add-on settings:
   - **From Station**: `Tullnerfeld Bahnhof` (or your starting station)
   - **To Station**: `Wien Hbf` (or your destination)
   - **Departure Hour**: `6`
   - **Departure Minute**: `30`
   - **Port**: `3000`

6. Click **"Start"** to start the add-on
7. Check the logs to ensure it's running correctly

### Step 3: Configure Home Assistant Sensors

Update `home-assistant-config.yaml` to use the add-on's internal port:

**Change:**
```yaml
resource: http://localhost:3000/api/trains
```

**To:**
```yaml
resource: http://localhost:3000/api/trains
# Note: localhost works because Home Assistant and the add-on share the same network
```

Or if using the add-on's hostname:
```yaml
resource: http://a0d7b954-oebb-train-checker:3000/api/trains
# Replace with your actual add-on hostname (check in add-on logs)
```

### Step 4: Add Sensors to Home Assistant

1. Edit your `configuration.yaml` file
2. Copy the sensor configurations from `home-assistant-config.yaml`
3. Restart Home Assistant

## Alternative: Custom Repository (For Distribution)

If you want to share this add-on or install it via repository:

1. Create a GitHub repository with this structure:
   ```
   repository/
     ├── oebb-train-checker/
     │   ├── config.json
     │   ├── Dockerfile
     │   ├── run.sh
     │   ├── build.yaml
     │   ├── oebb.js
     │   └── package.json
   ```

2. In Home Assistant:
   - Go to **Settings** → **Add-ons** → **Add-on Store**
   - Click **⋮** (three dots) → **Repositories**
   - Add: `https://github.com/yourusername/your-repo`
   - Click **"Add"** and wait for it to load
   - Find **"ÖBB Train Checker"** in the store and install

## Troubleshooting

### Add-on won't start
- Check the logs: **Settings** → **Add-ons** → **ÖBB Train Checker** → **Logs**
- Ensure ports aren't conflicting
- Verify Node.js dependencies installed correctly

### Can't access API from Home Assistant
- Verify the add-on is running
- Check the port configuration (default: 3000)
- Test with: `curl http://localhost:3000/health` from SSH

### Sensors not updating
- Verify REST sensor configuration in `configuration.yaml`
- Check sensor scan_interval (default: 300 seconds = 5 minutes)
- Restart Home Assistant after configuration changes

## API Endpoints

Once the add-on is running:

- `http://localhost:3000/api/trains` - All trains
- `http://localhost:3000/api/trains/next` - Next train only  
- `http://localhost:3000/health` - Health check
- `POST http://localhost:3000/api/trains/check` - Manual check trigger

## Support

For issues or questions, please check:
- Home Assistant logs
- Add-on logs in the Home Assistant UI
- GitHub issues (if using a repository)

