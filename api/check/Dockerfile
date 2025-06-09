# Use a Node.js base image
FROM node:18-alpine

RUN apk update && apk add --no-cache build-base \
&& rm -rf /var/cache/apk/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first.
COPY web/package*.json ./

# Install Node.js dependencies.
RUN npm install

# Copy the server code and the python script
COPY api/check/jcheck.cjs .

# Expose the port that the server is listening on
EXPOSE 5172

# Command to run the server, with explicit virtual environment activation
CMD [ "node", "jcheck.cjs" ]