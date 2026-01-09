#!/bin/bash

# Portfolio App - Uninstallation / Rollback Script
SERVICE_NAME="portfolio"
IMAGE_NAME="portfolio-app"

echo ">>> Starting Uninstallation..."

if systemctl is-active --quiet ${SERVICE_NAME}; then
    systemctl stop ${SERVICE_NAME}
fi

if systemctl is-enabled --quiet ${SERVICE_NAME}; then
    systemctl disable ${SERVICE_NAME}
fi

SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
if [ -f "$SERVICE_FILE" ]; then
    rm "$SERVICE_FILE"
    systemctl daemon-reload
fi

if [ "$(docker ps -q -f name=${SERVICE_NAME})" ]; then
    docker stop ${SERVICE_NAME}
fi

if [ "$(docker ps -aq -f name=${SERVICE_NAME})" ]; then
    docker rm ${SERVICE_NAME}
fi

if [ "$(docker images -q ${IMAGE_NAME})" ]; then
    docker rmi ${IMAGE_NAME}
fi

echo ">>> Uninstallation Complete!"
