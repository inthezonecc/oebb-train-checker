#!/usr/bin/with-contenv bashio
set -e

# Get configuration from Home Assistant add-on options
FROM_STATION=$(bashio::config 'from_station' 'Tullnerfeld Bahnhof')
TO_STATION=$(bashio::config 'to_station' 'Wien Hbf')
DEPARTURE_HOUR=$(bashio::config 'departure_hour' 6)
DEPARTURE_MINUTE=$(bashio::config 'departure_minute' 30)
PORT=$(bashio::config 'port' 3535)

# Write environment variables to s6-overlay environment directory
# This ensures they're available to the service
mkdir -p /run/s6/container_environment
echo "${FROM_STATION}" > /run/s6/container_environment/FROM_STATION
echo "${TO_STATION}" > /run/s6/container_environment/TO_STATION
echo "${DEPARTURE_HOUR}" > /run/s6/container_environment/DEPARTURE_HOUR
echo "${DEPARTURE_MINUTE}" > /run/s6/container_environment/DEPARTURE_MINUTE
echo "${PORT}" > /run/s6/container_environment/PORT

# Also export for current script context
export FROM_STATION
export TO_STATION
export DEPARTURE_HOUR
export DEPARTURE_MINUTE
export PORT

# Log configuration - write directly to stderr so it appears in logs
exec >&2
echo "========================================"
echo "Starting ÖBB Train Checker..."
echo "From: ${FROM_STATION}"
echo "To: ${TO_STATION}"
echo "Departure time: ${DEPARTURE_HOUR}:${DEPARTURE_MINUTE}"
echo "Port: ${PORT}"
echo "========================================"

