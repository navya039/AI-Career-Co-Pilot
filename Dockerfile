# Dockerfile

# --- Stage 1: Build React Frontend ---
# Use a Node.js image to build the static files
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install

# Copy the rest of the frontend code and build it
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build FastAPI Backend ---
# Use a Python image for the final application
FROM python:3.9-slim

WORKDIR /app

# Set up a non-root user for better security
RUN useradd --create-home appuser
USER appuser

# Install Python dependencies
COPY --chown=appuser:appuser backend/requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy the backend application code
COPY --chown=appuser:appuser backend/app/ ./app/

# Copy the built React frontend from the first stage
# This is the magic step that combines both parts
COPY --from=frontend-builder /app/frontend/build ./app/static

# Expose the port the app runs on
EXPOSE 8000

# Set the PATH to include user's local bin
ENV PATH="/home/appuser/.local/bin:${PATH}"

# Command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--chdir", "./app", "main:app"]