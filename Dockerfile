# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM python:3.9-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir flask requests

# Copy built assets from build stage
COPY --from=build /app/dist ./dist
COPY app.py .

COPY ignored_repos.txt .

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
