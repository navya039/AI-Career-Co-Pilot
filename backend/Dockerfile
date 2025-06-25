# Use an official, slim Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the updated requirements file
COPY backend/requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade pip -r requirements.txt

# Copy the entire backend application code into the container
COPY ./backend /app

# Command to run your application when the container starts
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000"]