# ÖBB Train Checker for Home Assistant

A Home Assistant add-on that checks ÖBB train schedules from Tullnerfeld Bahnhof to Wien Hbf every weekday morning at 6:30 AM and exposes the data via REST API for Home Assistant integration.

**✨ Now available as a Home Assistant add-on - runs directly in Home Assistant, no external server needed!**

## Features

- ✅ Automatically checks trains every weekday at 6:30 AM Vienna time
- ✅ REST API endpoint for Home Assistant integration
- ✅ Displays delays, cancellations, platforms, and remarks
- ✅ JSON format for easy Home Assistant sensor configuration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node oebb.js
```

The server will run on `http://localhost:3000` by default (configurable via `PORT` environment variable).

## API Endpoints

### `GET /api/trains`
Returns all available trains after 6:30 AM for the current day.

**Response:**
```json
{
  "status": "success",
  "lastUpdate": "2025-11-01T06:30:00.000Z",
  "count": 5,
  "from": {"name": "Tullnerfeld Bahnhof", "id": "1232120"},
  "to": {"name": "Wien Hbf (U)", "id": "1290401"},
  "trains": [
    {
      "line": "IC 460",
      "lineId": "12345",
      "cancelled": false,
      "origin": {"name": "Tullnerfeld Bahnhof", "id": "1232120"},
      "destination": {"name": "Wien Hbf", "id": "1290401"},
      "departure": {
        "time": "2025-11-01T06:45:00+01:00",
        "planned": "2025-11-01T06:45:00+01:00",
        "delayMinutes": 0,
        "platform": "1"
      },
      "arrival": {
        "time": "2025-11-01T07:05:00+01:00",
        "planned": "2025-11-01T07:05:00+01:00",
        "delayMinutes": 0,
        "platform": "10A-B"
      },
      "remarks": ["WLAN verfügbar", "SnackPoint/Imbiss im Zug"]
    }
  ]
}
```

### `GET /api/trains/next`
Returns only the next train (first in the list).

**Response:**
```json
{
  "status": "success",
  "lastUpdate": "2025-11-01T06:30:00.000Z",
  "train": { ... }
}
```

### `GET /health`
Health check endpoint.

### `POST /api/trains/check`
Manually trigger a train check.

## Home Assistant Integration

### Step 1: Update the API URL

Edit `home-assistant-config.yaml` and replace `http://localhost:3000` with your actual server URL:
- If Home Assistant runs on the same machine: `http://localhost:3000`
- If on different machines: `http://YOUR_SERVER_IP:3000`
- If using Home Assistant OS: You may need to use the internal network IP

### Step 2: Add to Home Assistant

1. Copy the contents of `home-assistant-config.yaml` to your Home Assistant `configuration.yaml`
2. Or add individual sensors manually via the UI:
   - Go to **Settings** → **Devices & Services** → **Add Integration**
   - Search for "REST" sensor
   - Add each sensor with the appropriate endpoint

### Step 3: Restart Home Assistant

Restart Home Assistant for the changes to take effect.

### Step 4: View Your Sensors

You'll have these sensors available:
- `sensor.oebb_trains` - All train data
- `sensor.oebb_next_train` - Next train summary
- `sensor.oebb_next_train_line` - Train line number
- `sensor.oebb_next_train_departure` - Departure time
- `sensor.oebb_next_train_delay` - Delay in minutes
- `sensor.oebb_next_train_cancelled` - Cancellation status
- `sensor.oebb_next_train_platform` - Platform number
- `sensor.oebb_next_train_arrival` - Arrival time
- `sensor.oebb_next_train_status` - Formatted status with template

### Example Automation

You can create automations to notify you about delays or cancellations. See the commented examples in `home-assistant-config.yaml`.

## Running as a Service

### Using PM2

```bash
npm install -g pm2
pm2 start oebb.js --name oebb-train-checker
pm2 save
pm2 startup
```

### Using systemd

Create `/etc/systemd/system/oebb-train-checker.service`:

```ini
[Unit]
Description=ÖBB Train Checker Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/oebb
ExecStart=/usr/bin/node /path/to/oebb/oebb.js
Restart=always
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable oebb-train-checker
sudo systemctl start oebb-train-checker
```

## Configuration

- **Port**: Set via `PORT` environment variable (default: 3000)
- **Station from**: Currently hardcoded to "Tullnerfeld Bahnhof"
- **Station to**: Currently hardcoded to "Wien Hbf"
- **Schedule time**: Currently hardcoded to 6:30 AM on weekdays

## License

ISC

