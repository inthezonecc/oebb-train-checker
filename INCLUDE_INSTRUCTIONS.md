# How to Include ÖBB Sensors Without Modifying configuration.yaml

Instead of adding sensors directly to `configuration.yaml`, you can reference separate YAML files using `!include`.

## Method 1: Include in sensor section (Recommended)

**In your `configuration.yaml`, find the `sensor:` section and add:**

```yaml
sensor: !include oebb-sensors.yaml
```

Or if you already have sensors defined:
```yaml
sensor:
  - platform: ...
  # your existing sensors
  - !include oebb-sensors.yaml
```

**Then:**
1. Copy `oebb-sensors.yaml` to your `/config/` directory (same location as `configuration.yaml`)
2. Restart Home Assistant

## Method 2: Include template sensors separately

If you want the template sensors too, add this to `configuration.yaml`:

```yaml
template: !include oebb-template-sensors.yaml
```

**Then:**
1. Copy `oebb-template-sensors.yaml` to your `/config/` directory
2. Restart Home Assistant

## Method 3: Copy files to Home Assistant

### Option A: Using File Editor Add-on

1. Go to **Settings** → **Add-ons** → **File editor**
2. Create or upload `oebb-sensors.yaml` to `/config/` directory
3. Copy the content from the file
4. Edit `configuration.yaml` to add the include line

### Option B: Using SSH

```bash
# SSH into Home Assistant
# Copy the files to /config/
cd /config

# Create oebb-sensors.yaml
nano oebb-sensors.yaml
# Paste the content, save with Ctrl+X, Y, Enter

# Then edit configuration.yaml to add the include line
nano configuration.yaml
# Add: sensor: !include oebb-sensors.yaml
```

## Full Example configuration.yaml additions:

```yaml
# Add this to your existing configuration.yaml

# REST sensors
sensor: !include oebb-sensors.yaml

# OR if you already have sensors:
sensor:
  # your existing sensors here
  - !include oebb-sensors.yaml

# Template sensors (optional)
template: !include oebb-template-sensors.yaml
```

## Files to Copy

1. **`oebb-sensors.yaml`** - Contains all REST sensors (required)
2. **`oebb-template-sensors.yaml`** - Contains template sensors (optional)

Both files go in the `/config/` directory (same folder as `configuration.yaml`).

## Verify After Including

1. **Restart Home Assistant**
2. Go to **Developer Tools** → **States**
3. Search for `oebb` - you should see your sensors
4. Wait 5 minutes for sensors to update (scan_interval: 300 seconds)

## Troubleshooting

**Sensors not appearing:**
- Check file path - must be in `/config/` directory
- Check `configuration.yaml` syntax - include line must be correct
- Check Home Assistant logs for YAML errors
- Verify file encoding (UTF-8)

**File not found error:**
- Ensure file is named exactly: `oebb-sensors.yaml`
- File must be in `/config/` directory
- Check file permissions (readable by Home Assistant)

