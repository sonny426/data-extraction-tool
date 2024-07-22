FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /usr/src/app

# Copy all source
COPY . .

# Download dependencies
RUN pip install -r requirements.txt

# Set port
EXPOSE 8000

# Launch backend
# CMD ["gunicorn", "CoreRoot.wsgi:application", "--bind", "0.0.0.0:8000"]