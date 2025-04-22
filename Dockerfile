# Use the official Node.js 20 image as the base image
FROM node:23-alpine3.20

# Set the working directory inside the container
WORKDIR /app

RUN mkdir envs

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3009

# Command to run your application
CMD ["npm","run","prod"]
