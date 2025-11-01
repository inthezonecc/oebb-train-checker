# Install ÖBB Train Checker to Home Assistant

## Repository URL
```
https://github.com/inthezonecc/oebb-train-checker
```

## Method 1: Install from Repository (Recommended)

### Step 1: Add Repository to Home Assistant

1. **Open Home Assistant**
2. Go to **Settings** → **Add-ons** → **Add-on Store**
3. Click the **three dots (⋮)** in the top right
4. Click **"Repositories"**
5. In the "Repository" field, enter:
   ```
   https://github.com/inthezonecc/oebb-train-checker
   ```
6. Click **"Add"**
7. Wait for Home Assistant to refresh the store

### Step 2: Install the Add-on

1. You should see **"ÖBB Train Checker Repository"** appear in the store
2. Find **"ÖBB Train Checker"** in the add-ons list
3. Click on it
4. Click **"Install"**
5. Wait for installation to complete (may take a few minutes)

### Step 3: Configure the Add-on

1. In the add-on page, click **"Configuration"** tab
2. Configure the settings:
   ```yaml
   from_station: Tullnerfeld Bahnhof
   to_station: Wien Hbf
   departure_hour: 6
   departure_minute: 30
   port: 3000
   ```
3. Click **"Save"**

### Step 4: Start the Add-on

1. Click the **"Info"** tab
2. Click **"Start"** button
3. Wait for the add-on to start
4. Check the **"Log"** tab to verify it's running:
   - You should see: `🚂 Train checker API server started!`
   - Server running on http://localhost:3000

### Step 5: Verify API is Working

1. In the add-on **"Log"** tab, you should see the API endpoints listed
2. You can test by going to **Developer Tools** → **YAML**
3. Run this service call:
   ```yaml
   service: shell_command.test_health
   ```
   Or use a REST API call in Developer Tools → States

## Method 2: Local Installation (If Repository Method Doesn't Work)

If the repository method doesn't work (image not built yet), you can install locally:

### Step 1: Copy Add-on to Home Assistant

1. **SSH into your Home Assistant machine** or use File Editor
2. Copy the `addon` directory to:
   ```
   /config/addons/oebb-train-checker/
   ```

3. Or use the File Editor:
   - Go to **Settings** → **Add-ons** → **File editor**
   - Create folder: `addons/oebb-train-checker`
   - Upload/copy all files from the `addon` directory

### Step 2: Install from Local Add-ons

1. Go to **Settings** → **Add-ons** → **Add-on Store**
2. Click **"Check for updates"** or refresh
3. Find **"ÖBB Train Checker"** in **"Local add-ons"** section
4. Click **"Install"**
5. Follow Steps 3-5 from Method 1 above

## Step 6: Configure Home Assistant Sensors

### Option A: Using YAML Configuration

1. Edit your `configuration.yaml` file
2. Copy the sensor configurations from `home-assistant-config.yaml`
3. Update the resource URLs:
   ```yaml
   sensor:
     - platform: rest
       name: OEBB Trains
       resource: http://localhost:3000/api/trains
       scan_interval: 300
       # ... rest of config
   ```

### Option B: Using UI Configuration

1. Go to **Settings** → **Devices & Services**
2. Click **"+ Add Integration"**
3. Search for **"REST"**
4. Add REST sensors for:
   - `http://localhost:3000/api/trains`
   - `http://localhost:3000/api/trains/next`
   - `http://localhost:3000/health`

## Step 7: Restart Home Assistant

1. Go to **Settings** → **System** → **Hardware**
2. Click **"Restart"** or **"Reboot"**
3. Wait for Home Assistant to restart

## Step 8: Verify Sensors

1. Go to **Developer Tools** → **States**
2. Search for `sensor.oebb`
3. You should see:
   - `sensor.oebb_trains`
   - `sensor.oebb_next_train`
   - `sensor.oebb_next_train_line`
   - etc.

## Troubleshooting

### Add-on Won't Start
- Check logs: **Settings** → **Add-ons** → **ÖBB Train Checker** → **Log**
- Verify configuration is correct
- Check port conflicts (port 3000 available?)

### Can't See Repository
- Verify URL is correct: `https://github.com/inthezonecc/oebb-train-checker`
- Check that repository is public (if private, use SSH authentication)
- Try refreshing the store

### API Not Accessible
- Verify add-on is running (green status)
- Check logs for errors
- Test health endpoint: Add-on should show running on port 3000

### Sensors Not Updating
- Verify REST sensors are configured correctly
- Check scan_interval (default: 300 seconds = 5 minutes)
- Restart Home Assistant after configuration changes

## Next Steps

Once installed:
- ✅ Add-on runs automatically every weekday at 6:30 AM
- ✅ API available at `http://localhost:3000/api/trains`
- ✅ Create automations for delays/cancellations (see `home-assistant-config.yaml`)
- ✅ Add to your Home Assistant dashboard

## Support

If you encounter issues:
1. Check add-on logs
2. Check Home Assistant logs
3. Verify configuration.yaml syntax
4. Test API endpoints manually

