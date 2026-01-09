#!/bin/bash

# Portfolio App Installation Script for Raspberry Pi
# Run this script with sudo: sudo ./install.sh

set -e

APP_DIR=$(pwd)
SERVICE_NAME="portfolio"
IMAGE_NAME="portfolio-app"
PORT=5000

echo ">>> Starting Installation..."

echo ">>> Starting Installation..."

if ! command -v docker &> /dev/null; then
    echo "Docker could not be found. Please install Docker first."
    exit 1
fi

if [ -f .env ]; then
    set -o allexport
    source .env
    set +o allexport
fi

systemctl restart docker
sleep 5

DOCKER_BUILDKIT=0 docker build --no-cache -t ${IMAGE_NAME} .

cat <<EOF > /etc/systemd/system/${SERVICE_NAME}.service

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

EOF

systemctl daemon-reload
systemctl enable ${SERVICE_NAME}
systemctl start ${SERVICE_NAME}

echo ">>> Installation Complete!"
echo ">>> App is running on port ${PORT}"
echo ">>> Check status with: systemctl status ${SERVICE_NAME}"
