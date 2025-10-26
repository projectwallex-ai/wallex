# Use official Node 20 LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 for DigitalOcean App Platform
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]

