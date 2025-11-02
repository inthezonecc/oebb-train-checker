FROM ghcr.io/hassio-addons/base:13.2.2

# Set working directory
WORKDIR /app

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY oebb.js ./

# Copy run script to cont-init.d (runs once at startup to set env vars)
COPY run.sh /etc/cont-init.d/99-run.sh
RUN chmod +x /etc/cont-init.d/99-run.sh

# Create service run script (runs continuously - env vars already set by cont-init.d)
# For s6-overlay v3, use services.d with proper structure
RUN mkdir -p /etc/services.d/app && \
    printf '%s\n' \
           '#!/command/with-contenv sh' \
           'set -e' \
           'exec 2>&1' \
           'echo "[SERVICE] ========================================"' \
           'echo "[SERVICE] Starting ÖBB Train Checker service..."' \
           'echo "[SERVICE] ========================================"' \
           'cd /app || exit 1' \
           'echo "[SERVICE] Working directory: $(pwd)"' \
           'echo "[SERVICE] Node version: $(node --version 2>&1 || echo "ERROR: node not found")"' \
           'echo "[SERVICE] Environment variables:"' \
           'echo "[SERVICE]   FROM_STATION=${FROM_STATION:-not set}"' \
           'echo "[SERVICE]   TO_STATION=${TO_STATION:-not set}"' \
           'echo "[SERVICE]   PORT=${PORT:-not set}"' \
           'echo "[SERVICE]   DEPARTURE_HOUR=${DEPARTURE_HOUR:-not set}"' \
           'echo "[SERVICE]   DEPARTURE_MINUTE=${DEPARTURE_MINUTE:-not set}"' \
           'echo "[SERVICE] Checking if oebb.js exists..."' \
           'if [ ! -f /app/oebb.js ]; then' \
           '  echo "[SERVICE] ERROR: oebb.js not found!"' \
           '  exit 1' \
           'fi' \
           'echo "[SERVICE] File exists: $(ls -la /app/oebb.js)"' \
           'echo "[SERVICE] Starting Node.js application..."' \
           'echo "[SERVICE] Node.js command: node /app/oebb.js"' \
           'exec node /app/oebb.js' \
    > /etc/services.d/app/run && \
    chmod +x /etc/services.d/app/run && \
    # Create finish script for proper service management
    printf '%s\n' \
           '#!/bin/sh' \
           'echo "[SERVICE] ÖBB Train Checker service stopped"' \
           'exit 0' \
    > /etc/services.d/app/finish && \
    chmod +x /etc/services.d/app/finish

# Expose port
EXPOSE 3535

