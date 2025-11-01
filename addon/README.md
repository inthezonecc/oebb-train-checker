# ÖBB Train Checker - Home Assistant Add-on

A Home Assistant add-on that monitors ÖBB train schedules from Tullnerfeld Bahnhof to Wien Hbf with delays, cancellations, and platform information.

## Installation

### Option 1: Manual Installation (for development)

1. Copy this add-on directory to your Home Assistant add-ons folder:
   ```
   /config/addons/oebb-train-checker/
   ```

2. Build the Docker image:
   ```bash
   docker build -t local/oebb-train-checker ./addon
   ```

3. Install via Home Assistant UI:
   - Go to **Settings** → **Add-ons** → **Add-on Store**
   - Click the three dots (⋮) → **Repositories**
   - Or install directly if added to local add-ons

### Option 2: Custom Repository (recommended)

1. Create a GitHub repository with this add-on structure

2. Add to Home Assistant:
   - Go to **Settings** → **Add-ons** → **Add-on Store**
   - Click the three dots (⋮) → **Repositories**
   - Add: `https://github.com/yourusername/oebb-train-checker`

3. Install the add-on from the store

## Configuration

Configure the add-on through the Home Assistant UI:

- **From Station**: Starting station (default: "Tullnerfeld Bahnhof")
- **To Station**: Destination station (default: "Wien Hbf")
- **Departure Hour**: Hour to check trains (0-23, default: 6)
- **Departure Minute**: Minute to check trains (0-59, default: 30)
- **Port**: API port (default: 3000)

## Usage

After installation:

1. **Start the add-on** from Home Assistant UI
2. The API will be available at `http://localhost:3000/api/trains`
3. **Configure Home Assistant sensors** using the REST sensor configuration from `home-assistant-config.yaml`

### API Endpoints

- `GET http://localhost:3000/api/trains` - All trains
- `GET http://localhost:3000/api/trains/next` - Next train only
- `GET http://localhost:3000/health` - Health check
- `POST http://localhost:3000/api/trains/check` - Manual check

## Home Assistant Integration

See `home-assistant-config.yaml` in the root directory for sensor configuration examples.

The add-on runs automatically every weekday at the configured time and exposes train data via REST API.

