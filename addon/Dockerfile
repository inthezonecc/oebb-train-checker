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
COPY run.sh ./

# Make run script executable
RUN chmod a+x /app/run.sh

# Expose port
EXPOSE 3000

# Use run.sh as entrypoint (Home Assistant add-on standard)
ENTRYPOINT ["/app/run.sh"]

