FROM python:3.9

# Set the working directory
WORKDIR /app

ENV PYTHONPATH=/app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose port 5000
EXPOSE 5002

# Run the main application
CMD ["python", "app.py"]
