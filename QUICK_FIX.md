# Quick Fix for Configuration Error

## The Error
```
Invalid config for 'sensor' at configuration.yaml, line 54: expected a dictionary
```

## The Problem
You're using `sensor: !include oebb-sensors.yaml` but you already have sensors defined.

## The Solution

### Option 1: If you already have sensors (MOST COMMON)

**In your `configuration.yaml`, find your existing `sensor:` section:**

```yaml
sensor:
  - platform: ...
  # your existing sensors
```

**Add the include like this (with a dash):**

```yaml
sensor:
  - platform: ...
  # your existing sensors
  
  # OEBB Train Checker sensors
  - !include oebb-sensors.yaml
```

**Change `sensor: !include` to `- !include`** (add the dash)

### Option 2: If sensor section doesn't exist or is empty

Then you can use:
```yaml
sensor: !include oebb-sensors.yaml
```

## Correct Examples

**If you have existing sensors:**
```yaml
sensor:
  - platform: weather
    name: Weather
  - platform: time_date
    name: Time
    
  # Add OEBB sensors
  - !include oebb-sensors.yaml
```

**If sensor section is new/empty:**
```yaml
sensor: !include oebb-sensors.yaml
```

## After Fixing

1. Save `configuration.yaml`
2. **Restart Home Assistant**
3. Check **Developer Tools** → **States** for `sensor.oebb_*` sensors

