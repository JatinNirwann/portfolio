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

# 2. Build Docker Image
echo ">>> Building Docker image ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

# 3. Create Systemd Service
echo ">>> Creating Systemd Service /etc/systemd/system/${SERVICE_NAME}.service..."

cat <<EOF > /etc/systemd/system/${SERVICE_NAME}.service
[Unit]
Description=Portfolio App Docker Container
After=docker.service
Requires=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker run --rm --name ${SERVICE_NAME} -p ${PORT}:5000 ${IMAGE_NAME}
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
