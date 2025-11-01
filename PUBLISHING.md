# Publishing Guide - Home Assistant Add-on

## Current Best Practices (2024-2025)

This document explains how modern Home Assistant add-on developers publish their add-ons.

## ✅ Structure Overview

### Repository Structure
```
oebb-train-checker/
├── repository.json          # Repository manifest
├── .github/
│   └── workflows/
│       └── build.yml        # CI/CD for building and publishing
├── addon/
│   ├── config.json          # Add-on configuration (or config.yaml)
│   ├── Dockerfile           # Container image definition
│   ├── build.yaml           # Build configuration for architectures
│   ├── run.sh               # Startup script
│   ├── oebb.js              # Application code
│   └── package.json         # Node.js dependencies
└── README.md
```

### ✅ What We Have (Correct)

1. **config.json** - ✅ Correct format for add-on configuration
2. **Dockerfile** - ✅ Uses Home Assistant base image
3. **run.sh** - ✅ Uses bashio for configuration
4. **build.yaml** - ✅ Defines supported architectures
5. **repository.json** - ✅ Repository manifest

### 🔄 Modern Publishing Approach

**Method 1: Pre-built Images (Recommended)**
- Build Docker images for all architectures
- Push to Docker Hub or GitHub Container Registry (GHCR)
- Reference image in `config.json`
- Use GitHub Actions for automated builds

**Method 2: Build on Install (Alternative)**
- Remove `image` field from `config.json`
- Home Assistant will build from Dockerfile on install
- Slower but doesn't require registry

## 🚀 Publishing Steps

### 1. GitHub Repository

Create a repository with this structure:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/oebb-train-checker.git
git push -u origin main
```

### 2. Set Up GitHub Actions

The `.github/workflows/build.yml` will automatically:
- Build images for all architectures on push
- Push to GHCR (`ghcr.io/yourusername/oebb-train-checker`)
- Tag images with version tags

### 3. Update config.json

Update the image reference:
```json
{
  "image": "ghcr.io/yourusername/oebb-train-checker:latest"
}
```

### 4. Add to Home Assistant

Users add your repository:
```
Settings → Add-ons → Add-on Store → ⋮ → Repositories
Add: https://github.com/yourusername/oebb-train-checker
```

## 📊 Comparison: Our Approach vs Community Add-ons

### Community Add-ons (hassio-addons)
- Use `config.yaml` (YAML format)
- Multiple add-ons in `addons/` subdirectory
- Build scripts in root directory
- Automated testing and CI/CD

### Our Approach
- ✅ Uses `config.json` (JSON works too)
- ✅ Single add-on structure (appropriate for dedicated repo)
- ✅ GitHub Actions CI/CD (modern approach)
- ✅ Pre-built images (faster installs)

## 🔑 Key Differences

### JSON vs YAML
- **Both work!** `config.json` and `config.yaml` are both supported
- Community add-ons often use YAML (more readable)
- Our JSON format is perfectly valid

### Image Publishing
- **Modern approach**: Pre-build and publish to registry
- **Legacy approach**: Build on install from Dockerfile
- **Our approach**: ✅ Modern (pre-built images)

### Repository Structure
- **Multi-addon repo**: `addons/name/config.json`
- **Single-addon repo**: `addon/config.json` (what we have)
- **Our structure**: ✅ Correct for dedicated repository

## 🎯 What Makes It Modern

1. ✅ **CI/CD Pipeline** - Automated builds via GitHub Actions
2. ✅ **Multi-architecture** - Supports all Home Assistant architectures
3. ✅ **Container Registry** - Images published to GHCR
4. ✅ **bashio Integration** - Uses Home Assistant's bashio library
5. ✅ **Configuration Schema** - Validates user input
6. ✅ **Health Checks** - Built-in health monitoring

## 📝 Notes

- Your `config.json` format is **100% correct** for current Home Assistant
- JSON vs YAML is a preference, not a requirement
- The structure matches how popular add-ons are organized
- GitHub Actions for CI/CD is the modern standard

## 🚨 To Complete Publishing

1. Update `repository.json` with your actual GitHub URL
2. Update `config.json` image to point to your registry
3. Enable GitHub Actions in your repository settings
4. Push code to trigger build pipeline
5. Share repository URL for users to install

Your add-on structure follows **current best practices**! 🎉

