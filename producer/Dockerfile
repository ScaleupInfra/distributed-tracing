# Use a Node.js base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port if necessary
EXPOSE 3000

# Run the producer script, which now includes the tracer setup
CMD ["node", "producer.js"]
