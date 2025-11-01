# Quick Dashboard Setup for ÖBB Train Checker

## Quick Steps to View the Dashboard

### Option 1: Add to Existing Dashboard (Easiest)

1. **Open Home Assistant**
2. Go to **Overview** (or any dashboard)
3. Click **⋮** (three dots) in the top right
4. Click **Edit Dashboard**
5. Click **⋮** → **Add Card**
6. Select **Manual**
7. **Copy the entire contents of `quick-dashboard.yaml`**
8. **Paste it into the editor**
9. Click **Save**

You should now see the ÖBB Train Schedule dashboard!

### Option 2: Create New Dashboard

1. Go to **Overview** → **⋮** → **Manage Dashboards**
2. Click **+ NEW DASHBOARD**
3. Give it a name like "ÖBB Trains"
4. Click **Add Card** → **Manual**
5. **Copy the entire contents of `quick-dashboard.yaml`**
6. **Paste it into the editor**
7. Click **Save**

## What You'll See

The dashboard shows:
- **Next Train**: Train line and time
- **Train Status**: On time, delayed, or cancelled
- **Train Details**: Line, departure, arrival, delay, platform
- **Last Updated**: When data was last fetched

## Prerequisites

Make sure you have:
1. ✅ ÖBB Train Checker add-on installed and **running**
2. ✅ Sensors configured in `configuration.yaml` (see `oebb-sensors-direct.yaml`)
3. ✅ Home Assistant restarted after adding sensors

## Troubleshooting

### If You See "Loading..." or "unavailable":

1. **Check Add-on Status:**
   - Go to **Settings** → **Add-ons** → **ÖBB Train Checker**
   - Make sure it says **"Running"** (not "Stopped")
   - Check the **Log** tab for errors

2. **Check Sensors:**
   - Go to **Developer Tools** → **States**
   - Search for `sensor.oebb_next_train`
   - If it shows "unavailable", the add-on might not be running

3. **Check API:**
   - Go to **Developer Tools** → **YAML**
   - Run: `service: rest_command.test_oebb_health` (if you have the test sensors)
   - Or SSH and run: `curl http://localhost:3000/health`

### If Sensors Are Missing:

1. **Add sensors to `configuration.yaml`:**
   - Copy sensors from `oebb-sensors-direct.yaml`
   - Add to your `sensor:` section in `configuration.yaml`
   - Restart Home Assistant

2. **Wait for sensors to update:**
   - Sensors scan every 5 minutes (300 seconds)
   - Or manually trigger: **Developer Tools** → **States** → find sensor → click refresh icon

## Example Dashboard Preview

```
🚂 ÖBB Train Schedule
━━━━━━━━━━━━━━━━━━━━━━
Next Train: REX 1234 at 06:45

Route: Tullnerfeld → Wien Hbf

Status: ✅ On Time

Train Details
━━━━━━━━━━━━━━━━━━━━━━
Train Line: REX 1234
Departure Time: 06:45
Arrival Time: 07:15
Delay: 0 min
Platform: 3
Last Updated: 07:00:15
```

Enjoy your train schedule dashboard! 🚂

