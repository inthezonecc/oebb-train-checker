# How to Verify ÖBB Sensors Are Configured

## Important: Where to Find Sensors

**Sensors do NOT appear in Settings → Devices & Services** (that's for integrations).

**Sensors configured in `configuration.yaml` appear as entities** in:
- **Developer Tools → States** (search for `sensor.oebb`)
- **Settings → Devices & Entities** (under "REST")

## Step 1: Check Developer Tools → States

1. Go to **Developer Tools** (left sidebar)
2. Click **States** tab
3. In the search box "Filter entities", type: `sensor.oebb`
4. You should see 8 sensors:
   - `sensor.oebb_trains`
   - `sensor.oebb_next_train`
   - `sensor.oebb_next_train_line`
   - `sensor.oebb_next_train_departure`
   - `sensor.oebb_next_train_delay`
   - `sensor.oebb_next_train_cancelled`
   - `sensor.oebb_next_train_platform`
   - `sensor.oebb_next_train_arrival`

## Step 2: If Sensors Don't Appear

### Check 1: Configuration File Location

Make sure you edited the correct `configuration.yaml`:
- Location: `/config/configuration.yaml`
- Not a subdirectory
- File was saved after editing

### Check 2: Verify Sensors in configuration.yaml

1. Open your `configuration.yaml` file
2. Search for `sensor:` (should find it once)
3. Under `sensor:`, you should see 8 entries starting with `- platform: rest`
4. All entries should have `name: OEBB` or `name: OEBB Next Train` etc.

### Check 3: Check for YAML Errors

1. Go to **Developer Tools → YAML**
2. Look for configuration errors
3. Common errors:
   - `Invalid config for 'sensor'` - YAML syntax error
   - `duplicate key 'sensor'` - Multiple sensor sections

### Check 4: Check Logs

1. Go to **Settings → System → Logs**
2. Look for sensor-related errors
3. Common errors:
   - REST sensor connection errors
   - YAML parsing errors

## Step 3: Restart Home Assistant (Required)

Sensors are only created when Home Assistant starts:

1. Go to **Settings → System**
2. Click **Restart**
3. Wait 2-3 minutes
4. Check **Developer Tools → States** again

## Step 4: Verify Configuration Syntax

Your `configuration.yaml` should have this structure:

```yaml
sensor:
  # Your existing template sensors...
  - platform: template
    sensors:
      solar_saving_total_old_price:
        ...

  # ÖBB sensors - all under the same sensor: key
  - platform: rest
    name: OEBB Trains
    ...

  - platform: rest
    name: OEBB Next Train
    ...
```

**Important:** All sensors must be under a single `sensor:` key, not multiple `sensor:` keys.

## Step 5: Test Configuration

After restart, if sensors appear but show "unavailable":

1. **Check Add-on Status:**
   - Go to **Settings → Add-ons → ÖBB Train Checker**
   - Should show **"Running"** (not "Stopped")
   - Check **Log** tab for errors

2. **Test API Manually:**
   - SSH into Home Assistant or use Terminal add-on
   - Run: `curl http://localhost:3000/health`
   - Should return: `{"status":"ok"}` or similar

3. **Wait for First Scan:**
   - Sensors scan every 5 minutes (300 seconds)
   - Or manually refresh: **Developer Tools → States** → find sensor → click refresh icon

## Troubleshooting

### If Sensors Still Don't Appear:

1. **Check File Editor:**
   - Use **File Editor** add-on to view `/config/configuration.yaml`
   - Verify sensors are actually in the file

2. **Check for Duplicate Keys:**
   ```yaml
   # ❌ WRONG - Multiple sensor: keys
   sensor:
     - platform: template
       ...
   sensor:  # ERROR: duplicate!
     - platform: rest
       ...
   
   # ✅ CORRECT - One sensor: key
   sensor:
     - platform: template
       ...
     - platform: rest
       ...
   ```

3. **Check Indentation:**
   - YAML uses 2 spaces (not tabs, not 4 spaces)
   - All sensor entries should be at the same indentation level

4. **Re-verify Configuration:**
   - Copy the complete configuration from `configuration-complete.yaml`
   - Replace your entire `configuration.yaml` with it
   - Restart Home Assistant

## Quick Checklist

- [ ] Sensors are in `/config/configuration.yaml`
- [ ] All sensors under single `sensor:` key
- [ ] Proper YAML indentation (2 spaces)
- [ ] No syntax errors in Developer Tools → YAML
- [ ] Configuration.yaml saved
- [ ] Home Assistant restarted after adding sensors
- [ ] Checked Developer Tools → States (not Configuration UI)
- [ ] Add-on is running

Remember: **Sensors appear as entities in Developer Tools → States**, not in the Configuration UI!

