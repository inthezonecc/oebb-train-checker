# ⚠️ SETUP SENSORS FIRST!

## You're seeing "Entity not found" because sensors need to be added first!

The dashboard is configured correctly, but Home Assistant needs the sensors to be created first.

## Quick Fix (3 Steps):

### Step 1: Add Sensors to configuration.yaml

Open your `configuration.yaml` file and add these sensors:

**Copy this entire section:**

```yaml
sensor:
  # ÖBB Train Checker Sensors
  - platform: rest
    name: OEBB Trains
    resource: http://localhost:3000/api/trains
    scan_interval: 300
    json_attributes:
      - trains
      - from
      - to
      - count
      - lastUpdate
      - status
    value_template: "{{ value_json.status }}"

  - platform: rest
    name: OEBB Next Train
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    json_attributes:
      - train
      - lastUpdate
      - status
    value_template: >
      {% if value_json.train %}
        {{ value_json.train.line }} at {{ as_timestamp(value_json.train.departure.time) | timestamp_custom('%H:%M') }}
      {% else %}
        No trains
      {% endif %}

  - platform: rest
    name: OEBB Next Train Line
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: "{{ value_json.train.line | default('N/A') }}"

  - platform: rest
    name: OEBB Next Train Departure
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: >
      {% if value_json.train and value_json.train.departure.time %}
        {{ as_timestamp(value_json.train.departure.time) | timestamp_custom('%H:%M') }}
      {% else %}
        N/A
      {% endif %}

  - platform: rest
    name: OEBB Next Train Delay
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    unit_of_measurement: "min"
    value_template: "{{ value_json.train.departure.delayMinutes | default(0) }}"

  - platform: rest
    name: OEBB Next Train Cancelled
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: "{{ value_json.train.cancelled | default(false) }}"

  - platform: rest
    name: OEBB Next Train Platform
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: "{{ value_json.train.departure.platform | default('N/A') }}"

  - platform: rest
    name: OEBB Next Train Arrival
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: >
      {% if value_json.train and value_json.train.arrival.time %}
        {{ as_timestamp(value_json.train.arrival.time) | timestamp_custom('%H:%M') }}
      {% else %}
        N/A
      {% endif %}
```

**Note:** If you already have a `sensor:` section, just add these entries under that section (don't create a new `sensor:` key).

### Step 2: Verify Add-on is Running

1. Go to **Settings** → **Add-ons** → **ÖBB Train Checker**
2. Make sure it says **"Running"** (not "Stopped")
3. If it's stopped, click **"Start"**

### Step 3: Restart Home Assistant

1. Go to **Settings** → **System** → **Restart**
2. Click **"RESTART"**
3. Wait for Home Assistant to restart (2-3 minutes)

### Step 4: Check the Dashboard Again

After restart:
1. Go back to your dashboard
2. The "Entity not found" errors should be gone
3. You should see train data (or "Loading..." if the add-on is still initializing)

## Troubleshooting

### If Sensors Still Show "unavailable":

1. **Check Add-on Status:**
   - Go to **Settings** → **Add-ons** → **ÖBB Train Checker**
   - Check the **Log** tab for errors
   - If add-on is stopped, try starting it

2. **Check API Manually:**
   - SSH into Home Assistant or use Terminal add-on
   - Run: `curl http://localhost:3000/health`
   - Should return: `{"status":"ok"}` or similar

3. **Check Sensor Configuration:**
   - Go to **Developer Tools** → **States**
   - Search for `sensor.oebb_next_train`
   - If it doesn't exist, the sensors weren't added correctly
   - If it shows "unavailable", the add-on isn't responding

4. **Verify Port:**
   - Make sure port 3000 is configured correctly in add-on settings
   - Check if another service is using port 3000

### If You Still See Errors:

1. **Check YAML Syntax:**
   - Go to **Developer Tools** → **YAML**
   - Check for syntax errors
   - Home Assistant will tell you if there's a YAML error

2. **Check Logs:**
   - Go to **Settings** → **System** → **Logs**
   - Look for REST sensor errors

## Alternative: Use the Included File

If you prefer, you can use the included sensor file:

```yaml
sensor: !include oebb-sensors-direct.yaml
```

But you may need to merge it manually if you have existing sensors.

---

**Once sensors are added and Home Assistant is restarted, your dashboard should work!** 🚂

