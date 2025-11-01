# Test Dashboard Setup for ÖBB Train Checker

This guide helps you test if the ÖBB Train Checker add-on is working, even if logs aren't showing.

## Step 1: Add Test Sensors

Add this to your `configuration.yaml`:

```yaml
# REST Command to test health endpoint
rest_command:
  test_oebb_health:
    url: http://localhost:3000/health
    method: GET
    timeout: 5

# Health Check Sensor
sensor:
  - platform: rest
    name: OEBB Health Check
    resource: http://localhost:3000/health
    scan_interval: 30
    value_template: >
      {% if value_json %}
        {{ value_json.status | default('OK') }}
      {% elif value == 'ok' %}
        OK
      {% else %}
        {{ value | default('unavailable') }}
      {% endif %}

  - platform: template
    sensors:
      oebb_addon_status:
        friendly_name: ÖBB Add-on Status
        value_template: >
          {% if states('sensor.oebb_health_check') == 'unavailable' or
                states('sensor.oebb_health_check') == 'unknown' %}
            Offline
          {% else %}
            Online
          {% endif %}
        icon_template: >
          {% if states('sensor.oebb_health_check') == 'unavailable' or
                states('sensor.oebb_health_check') == 'unknown' %}
            mdi:server-off
          {% else %}
            mdi:server-network
          {% endif %}
```

Or use the included file:

```yaml
rest_command: !include oebb-test-sensors.yaml
sensor: !include oebb-test-sensors.yaml
```

**Note:** If you're using the direct include method, you may need to merge the REST command and sensor sections manually.

## Step 2: Restart Home Assistant

After adding the sensors, restart Home Assistant to load the new configuration.

## Step 3: Create Test Dashboard

1. Go to **Overview** → **⋮** (three dots) → **Edit Dashboard**
2. Click **⋮** → **Add Card** → **Manual**
3. Copy the contents of `test-dashboard.yaml` into the editor
4. Save the dashboard

## Step 4: Test the Add-on

### Method 1: Use the Dashboard Button

1. Open the test dashboard
2. Click the **"Test Health Endpoint"** button
3. Check the **"Health Check Result"** sensor

### Method 2: Use Developer Tools

1. Go to **Developer Tools** → **YAML**
2. Run this service:
   ```yaml
   service: rest_command.test_oebb_health
   ```
3. Check the response in **Developer Tools** → **States**
4. Look for `sensor.oebb_health_check`

### Method 3: Check Sensors Directly

1. Go to **Developer Tools** → **States**
2. Search for:
   - `sensor.oebb_health_check` - Should show "OK" or "unavailable"
   - `sensor.oebb_addon_status` - Should show "Online" or "Offline"

## What the Results Mean

### ✅ If API is Working:
- `sensor.oebb_health_check` = "OK" or shows JSON response
- `sensor.oebb_addon_status` = "Online"
- REST command returns 200 OK
- The add-on is running and API is accessible

### ❌ If API is NOT Working:
- `sensor.oebb_health_check` = "unavailable" or "unknown"
- `sensor.oebb_addon_status` = "Offline"
- REST command fails with connection error
- The add-on might not be running or the API isn't starting

## Troubleshooting

### If API is Not Responding:

1. **Check Add-on Status:**
   - Go to **Settings** → **Add-ons** → **ÖBB Train Checker**
   - Verify it says "Running" (not "Stopped")
   - Check the **Log** tab for errors

2. **Check Port:**
   - Verify port 3000 is configured correctly
   - Check if another service is using port 3000

3. **Check Network:**
   - If using Home Assistant OS, `localhost:3000` should work
   - If using Docker, you might need to use the container IP

4. **Manual Test:**
   - SSH into Home Assistant
   - Run: `curl http://localhost:3000/health`
   - If this works, the issue is with the sensor configuration
   - If this fails, the add-on isn't starting properly

### If API is Responding but Sensors Show "unavailable":

1. **Check Sensor Configuration:**
   - Verify the REST sensor URL is correct
   - Check scan_interval isn't too short
   - Restart Home Assistant

2. **Check Logs:**
   - Go to **Settings** → **System** → **Logs**
   - Look for REST sensor errors

## Next Steps

Once you confirm the API is working:
1. Add the main ÖBB sensors from `oebb-sensors-direct.yaml`
2. Create the main dashboard from `simple-dashboard-card.yaml`
3. Set up automations based on train delays/cancellations

