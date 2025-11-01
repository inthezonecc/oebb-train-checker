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

# Copy run script to s6 service directory
RUN mkdir -p /etc/s6-overlay/s6-rc.d/svc/run
COPY run.sh /etc/cont-init.d/99-run.sh
RUN chmod +x /etc/cont-init.d/99-run.sh

# Expose port
EXPOSE 3000

# Create s6 service
RUN \
    printf '#!/command/with-contenv /bin/bashio\n' \
    'cd /app\n' \
    'exec node oebb.js\n' \
    > /etc/s6-overlay/s6-rc.d/svc/run \
    && chmod +x /etc/s6-overlay/s6-rc.d/svc/run

