# Fix: Merge OEBB Sensors with Existing Sensors

## The Problem
You have existing sensors and want to add OEBB sensors, but `- !include` doesn't work with a list.

## Solution: Use `!include_dir_list`

This is the best way to merge multiple sensor files.

### Step 1: Create Sensors Directory

**Using File Editor or SSH:**
```bash
mkdir /config/sensors
```

### Step 2: Organize Your Sensor Files

**Option A: Put all sensors in separate files (Recommended)**

1. Create `/config/sensors/oebb.yaml` - Copy content from `oebb-sensors.yaml`
2. Create `/config/sensors/solar.yaml` - Put your solar sensors there
3. Or keep existing sensors in `configuration.yaml`

**Option B: Use directory for all sensors**

1. Move all your sensor definitions to separate files in `/config/sensors/`
2. Each platform gets its own file (e.g., `template.yaml`, `oebb.yaml`)

### Step 3: Update configuration.yaml

**If using Option A (mixed approach):**

```yaml
sensor:
  # Include all files from sensors directory
  - !include_dir_list sensors/
  
  # Your existing sensors can stay in configuration.yaml
  - platform: template
    sensors:
      solar_saving_total_old_price:
        # ... rest of your sensors
```

**If using Option B (all sensors in directory):**

```yaml
sensor: !include_dir_list sensors/
```

This includes ALL `.yaml` files from the `sensors/` directory.

### Step 4: File Structure

Your `/config/` directory should look like:
```
/config/
├── configuration.yaml
└── sensors/
    ├── oebb.yaml          # OEBB train sensors
    └── solar.yaml         # Your solar sensors (if you move them)
```

### Step 5: Copy OEBB Sensors File

Copy `oebb-sensors.yaml` to `/config/sensors/oebb.yaml`

**The file should start with:**
```yaml
- platform: rest
  name: OEBB Trains
  # ... etc
```

(NOTE: The file should already start with `- platform:` - keep it as-is)

### Step 6: Restart Home Assistant

1. Save all files
2. Restart Home Assistant
3. Verify sensors in Developer Tools → States

## Alternative: Manual Merge (If directory method doesn't work)

If `!include_dir_list` doesn't work, manually merge in `configuration.yaml`:

```yaml
sensor:
  # OEBB sensors (from oebb-sensors.yaml)
  - platform: rest
    name: OEBB Trains
    resource: http://localhost:3000/api/trains
    # ... copy all from oebb-sensors.yaml
  
  # Your existing sensors
  - platform: template
    sensors:
      solar_saving_total_old_price:
        # ... your existing sensors
```

## Quick Solution Summary

**Best approach:**
1. Create `/config/sensors/` directory
2. Copy `oebb-sensors.yaml` to `/config/sensors/oebb.yaml`
3. In `configuration.yaml`, change to:
   ```yaml
   sensor: !include_dir_list sensors/
   ```
4. Move all your sensor definitions to files in `/config/sensors/`

**OR simpler (keep existing structure):**
1. Remove `- !include oebb-sensors.yaml`
2. Manually copy all sensors from `oebb-sensors.yaml` into your `configuration.yaml` under `sensor:`
3. Keep your existing solar sensors as-is

