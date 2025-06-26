# Use an official, slim Python image as the base
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements file first to leverage Docker's caching
COPY backend/requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade pip -r requirements.txt

# Now, copy the entire backend application code into the container
COPY ./backend /app

# The command that will be run when the container starts
# This runs your FastAPI app using Gunicorn, a production-ready server
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000"]