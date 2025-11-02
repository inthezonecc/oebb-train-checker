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
# Using RUN to create service script directly with proper structure
RUN mkdir -p /etc/services.d/app

# Copy service run script - created as separate step for better visibility
RUN echo '#!/command/with-contenv sh' > /etc/services.d/app/run && \
    echo 'exec 2>&1' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] ========================================"' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] Starting ÖBB Train Checker service..."' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] ========================================"' >> /etc/services.d/app/run && \
    echo 'cd /app || exit 1' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] Working directory: $(pwd)"' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] Node version: $(node --version 2>&1 || echo "ERROR")"' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] PORT=${PORT}"' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] Checking oebb.js..."' >> /etc/services.d/app/run && \
    echo 'ls -la /app/oebb.js || exit 1' >> /etc/services.d/app/run && \
    echo 'echo "[SERVICE] Starting Node.js..."' >> /etc/services.d/app/run && \
    echo 'exec node /app/oebb.js' >> /etc/services.d/app/run && \
    chmod +x /etc/services.d/app/run

# Create finish script
RUN echo '#!/bin/sh' > /etc/services.d/app/finish && \
    echo 'echo "[SERVICE] Stopped"' >> /etc/services.d/app/finish && \
    echo 'exit 0' >> /etc/services.d/app/finish && \
    chmod +x /etc/services.d/app/finish

# Expose port
EXPOSE 3535

