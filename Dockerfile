FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port
EXPOSE 5000

# Set environment variable for port
ENV PORT=5000

# Run gunicorn
CMD gunicorn --bind 0.0.0.0:5000 contact_form:app
