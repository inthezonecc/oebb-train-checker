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

# Create service run script (runs continuously - no bashio here)
RUN mkdir -p /etc/services.d/app && \
    printf '#!/command/with-contenv sh\n' \
           'cd /app\n' \
           'exec node oebb.js\n' \
    > /etc/services.d/app/run && \
    chmod +x /etc/services.d/app/run

# Expose port
EXPOSE 3000

