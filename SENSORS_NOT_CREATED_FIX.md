# Sensors Not Being Created - Troubleshooting Guide

If sensors are not appearing in **Developer Tools → States** after restarting Home Assistant, follow these steps:

## Step 1: Check for YAML Syntax Errors

1. **Go to Developer Tools → YAML**
2. **Look for configuration errors** - Any red error messages?
3. **Common errors:**
   - `Invalid config for 'sensor'` - YAML syntax error
   - `duplicate key 'sensor'` - Multiple sensor: sections
   - Indentation errors

**If you see errors, fix them first!**

## Step 2: Verify Configuration File Location

Make sure you edited the correct file:
- **Location:** `/config/configuration.yaml`
- **Not:** A file in a subdirectory
- **Not:** A backup file

Use **File Editor** add-on to verify:
1. Open **File Editor**
2. Navigate to `/config/configuration.yaml`
3. Search for `# ÖBB Train Checker Sensors`
4. Verify all 8 sensors are present

## Step 3: Check YAML Structure

Your `sensor:` section should look like this:

```yaml
sensor:
  # First sensor group (template sensors)
  - platform: template
    sensors:
      solar_saving_total_old_price:
        ...

  # Second sensor group (template sensors)
  - platform: template
    sensors:
      solar_saving_total_new_price:
        ...

  # ÖBB sensors (REST sensors) - all under the same sensor: key
  - platform: rest
    name: OEBB Trains
    ...

  - platform: rest
    name: OEBB Next Train
    ...
```

**Important Checks:**
- ✅ Only ONE `sensor:` key in the entire file
- ✅ All sensors are listed under that single `sensor:` key
- ✅ Proper indentation (2 spaces, not tabs)
- ✅ Each sensor entry starts with `- platform:`

## Step 4: Check for Common Issues

### Issue 1: Duplicate `sensor:` Keys

```yaml
# ❌ WRONG - This will cause sensors not to load
sensor:
  - platform: template
    ...

sensor:  # ERROR: Duplicate key!
  - platform: rest
    ...

# ✅ CORRECT - All sensors under one sensor: key
sensor:
  - platform: template
    ...
  - platform: rest
    ...
```

### Issue 2: Wrong Indentation

```yaml
# ❌ WRONG - 4 spaces or tabs
sensor:
    - platform: rest
      name: OEBB Trains

# ✅ CORRECT - 2 spaces
sensor:
  - platform: rest
    name: OEBB Trains
```

### Issue 3: Missing or Extra Characters

- No trailing spaces
- No tabs (use spaces only)
- Proper line endings

## Step 5: Check Home Assistant Logs

1. **Go to Settings → System → Logs**
2. **Look for sensor-related errors:**
   - REST sensor errors
   - YAML parsing errors
   - Configuration validation errors

3. **Common log messages:**
   - `Invalid config for 'sensor'` - Fix YAML syntax
   - `REST sensor failed` - API endpoint issue (OK if add-on not running yet)
   - `Configuration validation failed` - YAML structure issue

## Step 6: Verify Configuration is Loaded

1. **Go to Developer Tools → YAML**
2. **Run this test template:**
   ```yaml
   {{ states | count }}
   ```
3. **This shows total entity count** - Should be > 0

If this doesn't work, there's a configuration error preventing Home Assistant from loading.

## Step 7: Force Configuration Reload

1. **Go to Developer Tools → YAML**
2. **Click "Check Configuration"** (if available)
3. **Or restart Home Assistant again:**
   - Settings → System → Restart
   - Wait 2-3 minutes

## Step 8: Manual Configuration Test

1. **Use File Editor** to open `/config/configuration.yaml`
2. **Copy a working sensor** (like your solar sensor)
3. **Create a test REST sensor** to verify REST platform works:

```yaml
sensor:
  # ... your existing sensors ...

  # Test sensor
  - platform: rest
    name: Test REST Sensor
    resource: http://httpbin.org/json
    scan_interval: 60
    value_template: "{{ value_json.slideshow.title | default('Test') }}"
```

4. **Restart Home Assistant**
5. **Check Developer Tools → States** for `sensor.test_rest_sensor`

If this test sensor appears, REST platform works. If not, there's a YAML syntax issue.

## Step 9: Minimal Configuration Test

If nothing works, try a minimal test:

1. **Backup your current `configuration.yaml`**
2. **Create a minimal test file:**

```yaml
default_config:

sensor:
  - platform: rest
    name: OEBB Test
    resource: http://localhost:3000/health
    scan_interval: 300
    value_template: "{{ value_json.status | default('unavailable') }}"
```

3. **Restart Home Assistant**
4. **Check Developer Tools → States** for `sensor.oebb_test`

If this appears, your full config has an issue. If not, there's a fundamental problem.

## Step 10: Check Home Assistant Version

Some Home Assistant versions have issues with REST sensors. Check:
1. **Settings → System → System Health**
2. **Note your Home Assistant Core version**
3. **REST sensors should work in all modern versions**

## Quick Checklist

Before asking for help, verify:
- [ ] Configuration.yaml is saved (not just edited)
- [ ] File is in `/config/configuration.yaml` (correct location)
- [ ] Only ONE `sensor:` key in the file
- [ ] All sensors under the single `sensor:` key
- [ ] Proper YAML indentation (2 spaces)
- [ ] No syntax errors in Developer Tools → YAML
- [ ] No errors in Settings → System → Logs
- [ ] Home Assistant fully restarted (wait 2-3 minutes)
- [ ] Checked Developer Tools → States (not Configuration UI)
- [ ] Searched for `sensor.oebb` (not just `sensor`)

## Still Not Working?

If sensors still don't appear after all steps:

1. **Share your configuration.yaml** (the sensor: section)
2. **Share any error messages** from:
   - Developer Tools → YAML
   - Settings → System → Logs
3. **Share Home Assistant version** (Settings → System → System Health)

This will help identify the specific issue.

