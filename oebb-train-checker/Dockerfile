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
RUN mkdir -p /etc/services.d/app && \
    printf '#!/bin/sh\n' \
           'exec 2>&1\n' \
           'echo "[SERVICE] ========================================"\n' \
           'echo "[SERVICE] Starting ÖBB Train Checker service..."\n' \
           'echo "[SERVICE] ========================================"\n' \
           'cd /app\n' \
           'echo "[SERVICE] Working directory: $(pwd)"\n' \
           'echo "[SERVICE] Node version: $(node --version 2>&1)"\n' \
           'echo "[SERVICE] Environment variables:"\n' \
           'echo "[SERVICE]   FROM_STATION=${FROM_STATION}"\n' \
           'echo "[SERVICE]   TO_STATION=${TO_STATION}"\n' \
           'echo "[SERVICE]   PORT=${PORT}"\n' \
           'echo "[SERVICE]   DEPARTURE_HOUR=${DEPARTURE_HOUR}"\n' \
           'echo "[SERVICE]   DEPARTURE_MINUTE=${DEPARTURE_MINUTE}"\n' \
           'echo "[SERVICE] Checking if oebb.js exists..."\n' \
           'ls -la /app/oebb.js || echo "[SERVICE] ERROR: oebb.js not found!"\n' \
           'echo "[SERVICE] Starting Node.js application..."\n' \
           'exec node /app/oebb.js\n' \
    > /etc/services.d/app/run && \
    chmod +x /etc/services.d/app/run && \
    # Create finish script for proper service management
    printf '#!/bin/sh\n' \
           'echo "[SERVICE] ÖBB Train Checker service stopped"\n' \
           'exit 0\n' \
    > /etc/services.d/app/finish && \
    chmod +x /etc/services.d/app/finish

# Expose port
EXPOSE 3535

