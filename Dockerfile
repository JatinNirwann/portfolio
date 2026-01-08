# Build stage
FROM node:18-alpine as build
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
COPY --from=build /app/app.py .
COPY --from=build /app/repo.txt .
COPY --from=build /app/ignored_repos.txt .

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
