# Contributing to ÖBB Train Checker Add-on

## Development Setup

### Prerequisites
- Home Assistant (Supervised or OS installation)
- Git
- Docker (for building)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/oebb-train-checker.git
   cd oebb-train-checker
   ```

2. For local testing, copy the addon directory to Home Assistant:
   ```bash
   cp -r addon /config/addons/oebb-train-checker
   ```

3. Test in Home Assistant:
   - Go to **Settings** → **Add-ons** → **Add-on Store**
   - Refresh and find **ÖBB Train Checker**
   - Install and test

## Building

### Manual Build

```bash
cd addon
docker build -t local/oebb-train-checker .
```

### Using Home Assistant Builder

```bash
docker run --rm --privileged -v "$(pwd)":/data homeassistant/amd64-builder --all -t oebb-train-checker --target oebb-train-checker
```

## Publishing

Images are automatically built and published to GitHub Container Registry via GitHub Actions on push to main branch.

Manual publishing:
1. Build for all architectures using the build script
2. Push to GHCR or Docker Hub
3. Update `config.json` with the image URL

## Code Style

- Follow Node.js best practices
- Use ESLint for code quality
- Add comments for complex logic
- Keep functions focused and testable

## Testing

Before submitting:
1. Test locally in Home Assistant
2. Verify all configuration options work
3. Check logs for errors
4. Test API endpoints

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a PR with a clear description

