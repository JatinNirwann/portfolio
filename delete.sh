#!/bin/bash

# Portfolio App - Uninstallation / Rollback Script
SERVICE_NAME="portfolio"
IMAGE_NAME="portfolio-app"

echo ">>> Starting Uninstallation of ${SERVICE_NAME}..."

# 1. Stop and Disable Service
if systemctl is-active --quiet ${SERVICE_NAME}; then
    echo ">>> Stopping service..."
    systemctl stop ${SERVICE_NAME}
fi

if systemctl is-enabled --quiet ${SERVICE_NAME}; then
    echo ">>> Disabling service..."
    systemctl disable ${SERVICE_NAME}
fi

# 2. Remove Systemd File
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
if [ -f "$SERVICE_FILE" ]; then
    echo ">>> Removing service file: $SERVICE_FILE"
    rm "$SERVICE_FILE"
    systemctl daemon-reload
    echo ">>> Service file removed and daemon reloaded."
else
    echo ">>> Service file not found (already removed?)"
fi

# 3. Cleanup Docker Resources
echo ">>> Cleaning up Docker resources..."

# Stop container if running (redundant check if service worked, but good for safety)
if [ "$(docker ps -q -f name=${SERVICE_NAME})" ]; then
    echo ">>> Stopping running container..."
    docker stop ${SERVICE_NAME}
fi

# Remove container (even if stopped)
if [ "$(docker ps -aq -f name=${SERVICE_NAME})" ]; then
    echo ">>> Removing container..."
    docker rm ${SERVICE_NAME}
fi

# Remove Image
if [ "$(docker images -q ${IMAGE_NAME})" ]; then
    echo ">>> Removing Docker image: ${IMAGE_NAME}..."
    docker rmi ${IMAGE_NAME}
else
    echo ">>> Docker image not found (already removed?)"
fi

echo ">>> ---------------------------------------------------"
echo ">>> Uninstallation Complete!"
echo ">>> All system artifacts and docker images have been removed."
echo ">>> Note: Your source code and .env file were preserved."
echo ">>> ---------------------------------------------------"
