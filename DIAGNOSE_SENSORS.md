# Diagnosing Why Sensors Aren't Being Created

## The Problem
Only `update.obb_train_checker_update` appears, but none of the REST sensors (`sensor.oebb_trains`, etc.) are being created.

## Step-by-Step Diagnosis

### Step 1: Test if REST Platform Works

Add this test sensor to your `configuration.yaml` under the `sensor:` section:

```yaml
sensor:
  # ... your existing sensors ...

  # TEST SENSOR - Remove after testing
  - platform: rest
    name: Test REST Sensor
    resource: http://httpbin.org/json
    scan_interval: 60
    value_template: "{{ value_json.slideshow.title | default('Test Working') }}"
```

1. **Add this test sensor** to your `configuration.yaml`
2. **Restart Home Assistant**
3. **Check Developer Tools → States** for `sensor.test_rest_sensor`

**If this appears:** REST platform works, issue is with ÖBB sensors specifically
**If this doesn't appear:** REST platform isn't loading, there's a configuration issue

### Step 2: Check REST Platform Availability

REST platform should be built-in to Home Assistant. Verify:

1. **Go to Developer Tools → YAML**
2. **Check for any platform errors**
3. **Check Settings → System → Logs** for REST-related errors

### Step 3: Verify Configuration File Location

Make sure you're editing the correct file:

1. **Use File Editor add-on**
2. **Open `/config/configuration.yaml`** (not a subdirectory)
3. **Verify sensors are actually in the file**

### Step 4: Check for Hidden Characters or Encoding Issues

Sometimes copy-paste introduces issues:

1. **Open `/config/configuration.yaml` in File Editor**
2. **Go to line 90** (where `# ÖBB Train Checker Sensors` comment is)
3. **Verify proper spacing** (2 spaces, not tabs)
4. **Check for special characters**

### Step 5: Try Minimal Configuration

Temporarily simplify to test:

```yaml
sensor:
  # Minimal test - just one ÖBB sensor
  - platform: rest
    name: OEBB Test Trains
    resource: http://localhost:3000/api/trains
    scan_interval: 300
    value_template: "{{ value_json.status | default('unavailable') }}"
```

1. **Backup your current configuration**
2. **Replace sensor section with this minimal test**
3. **Restart Home Assistant**
4. **Check for `sensor.oebb_test_trains`**

**If this appears:** Your full config has an issue with one of the sensors
**If this doesn't appear:** REST platform or configuration loading issue

### Step 6: Check Home Assistant Version

Some older versions might have REST platform issues:

1. **Go to Settings → System → System Health**
2. **Check Home Assistant Core version**
3. **REST sensors should work in all modern versions (2021+)**

### Step 7: Verify Configuration is Being Read

1. **Go to Settings → Server Controls**
2. **Click "Check Configuration"** (if available)
3. **Look for any warnings or errors**

### Step 8: Full Configuration Reload

1. **Go to Settings → Server Controls**
2. **Click "Restart"** (full restart, not just reload)
3. **Wait 2-3 minutes**
4. **Check Developer Tools → States** again

### Step 9: Check Configuration Includes

If you're using `!include` statements, verify they're working:

1. **Check your `configuration.yaml` for `!include sensor` statements**
2. **Verify any included files exist**
3. **If using includes, make sure ÖBB sensors are in the included file**

## Most Likely Causes

1. **Configuration file not saved properly**
2. **REST platform not loading** (check logs)
3. **YAML indentation/spacing issue** (hidden characters)
4. **Configuration validation preventing sensors from loading**
5. **Home Assistant version incompatibility**

## Next Steps

Start with **Step 1** (Test REST Sensor). This will tell us if:
- REST platform works at all
- Issue is specific to ÖBB sensors
- There's a broader configuration problem

Share the results and we can proceed from there!

