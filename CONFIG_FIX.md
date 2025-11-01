# Fix Configuration Error - Sensor Include

## Your Current Configuration
```yaml
sensor:
  - !include oebb-sensors.yaml
```

## The Problem
When you use `- !include`, Home Assistant expects a single sensor definition, but `oebb-sensors.yaml` contains multiple sensors (a list).

## The Solution

### Option 1: Replace Entire Sensor Section (Simplest)

**Change your `configuration.yaml` to:**

```yaml
sensor: !include oebb-sensors.yaml
```

(Remove the dash - this replaces your entire sensor section)

**Then:**
1. Copy `oebb-sensors.yaml` to `/config/` directory
2. Restart Home Assistant

### Option 2: If You Have Other Sensors You Want to Keep

You need to merge them manually or use `!include_dir_list`:

**Create a sensors directory:**
```bash
mkdir /config/sensors
```

**Copy files:**
- Put `oebb-sensors.yaml` in `/config/sensors/oebb.yaml`
- Put your other sensor configs in separate files in `/config/sensors/`

**Then in `configuration.yaml`:**
```yaml
sensor: !include_dir_list sensors/
```

This will include all YAML files from the sensors directory.

### Option 3: Manual Merge (If you have just a few sensors)

In your `configuration.yaml`, manually add all sensors:

```yaml
sensor:
  # Your existing sensors
  - platform: time_date
    name: Time
  
  # OEBB sensors from oebb-sensors.yaml
  - platform: rest
    name: OEBB Trains
    resource: http://localhost:3000/api/trains
    # ... (copy all from oebb-sensors.yaml)
```

## Recommended: Use Option 1

Since you only have `- !include oebb-sensors.yaml`, change it to:

```yaml
sensor: !include oebb-sensors.yaml
```

This is the cleanest solution and will work immediately.

