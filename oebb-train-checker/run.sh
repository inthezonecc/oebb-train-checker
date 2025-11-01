#!/usr/bin/with-contenv bashio
set -e

# Get configuration from Home Assistant add-on options
FROM_STATION=$(bashio::config 'from_station' 'Tullnerfeld Bahnhof')
TO_STATION=$(bashio::config 'to_station' 'Wien Hbf')
DEPARTURE_HOUR=$(bashio::config 'departure_hour' 6)
DEPARTURE_MINUTE=$(bashio::config 'departure_minute' 30)
PORT=$(bashio::config 'port' 3000)

# Export environment variables for the Node.js app
export FROM_STATION
export TO_STATION
export DEPARTURE_HOUR
export DEPARTURE_MINUTE
export PORT

# Log configuration using echo (bashio logging seems to have issues)
echo "Starting ÖBB Train Checker..."
echo "From: ${FROM_STATION}"
echo "To: ${TO_STATION}"
echo "Departure time: ${DEPARTURE_HOUR}:${DEPARTURE_MINUTE}"
echo "Port: ${PORT}"

