# Troubleshooting: Sensors Not Appearing

## Problem: "No entities" when searching for ÖBB sensors

If you search for `sensor.oebb_next_train` in **Developer Tools → States** and see "No entities", the sensors haven't been created yet.

## Step 1: Check Configuration Syntax

1. Go to **Developer Tools → YAML**
2. Look for any errors or warnings
3. If you see configuration errors, fix them first

## Step 2: Verify configuration.yaml

Make sure your `configuration.yaml` has the sensors properly formatted. The `sensor:` section should look like this:

```yaml
sensor:
  # Your existing sensors...
  
  # ÖBB Train Checker Sensors (8 sensors total)
  - platform: rest
    name: OEBB Trains
    resource: http://localhost:3000/api/trains
    scan_interval: 300
    # ... (full config)
```

**Important checks:**
- ✅ All sensors are under the same `sensor:` section
- ✅ No duplicate `sensor:` keys
- ✅ Proper YAML indentation (2 spaces)
- ✅ All sensor entries start with `- platform: rest`

## Step 3: Check for YAML Errors

1. Go to **Settings → System → Logs**
2. Look for configuration errors related to sensors
3. Common errors:
   - `Invalid config for 'sensor'` - YAML syntax error
   - `duplicate key 'sensor'` - Multiple sensor sections
   - Indentation errors

## Step 4: Restart Home Assistant

**This is required after adding sensors!**

1. Go to **Settings → System**
2. Click **Restart** (or use the three dots menu)
3. Wait 2-3 minutes for Home Assistant to restart
4. After restart, check **Developer Tools → States** again

## Step 5: Verify Sensors Appear

After restart:

1. Go to **Developer Tools → States**
2. Search for `sensor.oebb`
3. You should see these 8 sensors:
   - `sensor.oebb_trains`
   - `sensor.oebb_next_train`
   - `sensor.oebb_next_train_line`
   - `sensor.oebb_next_train_departure`
   - `sensor.oebb_next_train_delay`
   - `sensor.oebb_next_train_cancelled`
   - `sensor.oebb_next_train_platform`
   - `sensor.oebb_next_train_arrival`

**Note:** Even if sensors show "unavailable", that's OK - it means they exist but the add-on isn't responding yet.

## Step 6: If Sensors Still Don't Appear

### Check 1: YAML Configuration Location

Make sure you edited the correct `configuration.yaml`:
- Should be in `/config/configuration.yaml`
- Not in a subdirectory
- Make sure you saved the file

### Check 2: YAML Syntax Issues

Look for these common problems:

```yaml
# ❌ WRONG - Multiple sensor: keys
sensor:
  - platform: template
    ...
sensor:  # ERROR: duplicate key!
  - platform: rest
    ...

# ✅ CORRECT - All sensors under one sensor: key
sensor:
  - platform: template
    ...
  - platform: rest
    ...
```

### Check 3: Indentation

YAML is sensitive to indentation:
```yaml
# ✅ CORRECT (2 spaces)
sensor:
  - platform: rest
    name: OEBB Trains

# ❌ WRONG (4 spaces or tabs)
sensor:
    - platform: rest
      name: OEBB Trains
```

## Step 7: Verify Add-on is Running

1. Go to **Settings → Add-ons → ÖBB Train Checker**
2. Make sure it shows **"Running"** (not "Stopped")
3. If stopped, click **"Start"**
4. Check the **Log** tab for any errors

## Step 8: Manual Test

After sensors appear (even if "unavailable"), test the API manually:

1. SSH into Home Assistant or use Terminal add-on
2. Run: `curl http://localhost:3000/health`
3. Should return: `{"status":"ok"}` or similar

If this fails, the add-on isn't starting properly.

## Quick Fix Checklist

- [ ] Configuration.yaml saved correctly
- [ ] All sensors under single `sensor:` section
- [ ] Proper YAML indentation (2 spaces)
- [ ] No syntax errors in Developer Tools → YAML
- [ ] Home Assistant restarted after adding sensors
- [ ] Add-on is running (Settings → Add-ons → ÖBB Train Checker)
- [ ] Checked Developer Tools → States after restart

Once sensors appear, the dashboard should work! 🚂

