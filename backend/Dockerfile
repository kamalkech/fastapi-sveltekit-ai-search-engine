# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory
WORKDIR /code

# Copy the requirements file
COPY ./requirements.txt /code/requirements.txt

# Install the dependencies
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code
COPY ./app /code/app
COPY ./main.py /code/main.py
COPY ./.env /code/.env

# Set the environment variable for Google Cloud credentials
# This assumes you have your credentials file in the current directory
ENV GOOGLE_APPLICATION_CREDENTIALS=/code/application_default_credentials.json

# Copy the Google Cloud credentials file
COPY ./application_default_credentials.json /code/application_default_credentials.json

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3333"]
