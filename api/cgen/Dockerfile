# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY web/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the server code and the python script
COPY api/cgen/server.cjs ./
COPY api/cgen/pygen.py ./
COPY api/cgen/.env ./
COPY api/cgen/requirements.txt ./

# Install Python and any necessary Python dependencies
RUN apk add --no-cache python3 py3-pip bash # Add bash to the image

# Create a virtual environment for Python dependencies
RUN python3 -m venv /app/venv

# Explicitly set PYTHONPATH before activating the venv
ENV PYTHONPATH = /app/venv/lib/python3.12/site-packages 

# Activate the virtual environment and install the Python dependencies
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Expose the port that the server is listening on
EXPOSE 5000

RUN python3 pygen.py

# Command to run the server, with explicit virtual environment activation
CMD [ "bash", "-c", "source /app/venv/bin/activate && node server.cjs" ]