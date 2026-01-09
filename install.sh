#!/bin/bash

# Portfolio App Installation Script for Raspberry Pi
# Run this script with sudo: sudo ./install.sh

set -e

APP_DIR=$(pwd)
SERVICE_NAME="portfolio"
IMAGE_NAME="portfolio-app"
PORT=5000

echo ">>> Starting Installation..."

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Docker could not be found. Please install Docker first."
    echo "Try: curl -sSL https://get.docker.com | sh"
    exit 1
fi

# Load .env variables if available
if [ -f .env ]; then
    echo ">>> Loading Environment Variables from .env..."
    set -o allexport
    source .env
    set +o allexport
else
    echo ">>> Warning: .env file not found. Systemd service will not have email credentials configured."
fi

# 2. Build Docker Image
echo ">>> Restarting Docker service to ensure clean state..."
systemctl restart docker
sleep 5

echo ">>> Building Docker image ${IMAGE_NAME}..."
# Using DOCKER_BUILDKIT=0 and --no-cache to bypass potential overlayfs/snapshotter issues on Pi
DOCKER_BUILDKIT=0 docker build --no-cache -t ${IMAGE_NAME} .

# 3. Create Systemd Service
echo ">>> Creating Systemd Service /etc/systemd/system/${SERVICE_NAME}.service..."

cat <<EOF > /etc/systemd/system/${SERVICE_NAME}.service
[Unit]
Description=Portfolio App Docker Container
After=docker.service
Requires=docker.service

[Service]
Restart=always
Environment="SMTP_EMAIL=${SMTP_EMAIL}"
Environment="SMTP_PASSWORD=${SMTP_PASSWORD}"
Environment="RECIPIENT_EMAIL=${RECIPIENT_EMAIL}"
ExecStart=/usr/bin/docker run --rm --name ${SERVICE_NAME} -p ${PORT}:5000 \
    -e SMTP_EMAIL=\${SMTP_EMAIL} \
    -e SMTP_PASSWORD=\${SMTP_PASSWORD} \
    -e RECIPIENT_EMAIL=\${RECIPIENT_EMAIL} \
    ${IMAGE_NAME}
ExecStop=/usr/bin/docker stop ${SERVICE_NAME}

[Install]
WantedBy=multi-user.target
EOF

# 4. Enable and Start Service
echo ">>> Enabling and Starting Service..."
systemctl daemon-reload
systemctl enable ${SERVICE_NAME}
systemctl start ${SERVICE_NAME}

echo ">>> Installation Complete!"
echo ">>> App is running on port ${PORT}"
echo ">>> Check status with: systemctl status ${SERVICE_NAME}"
