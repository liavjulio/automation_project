# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]