# Tests Container Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy test files
COPY . .

# Set environment variables
ENV NODE_ENV=test
ENV API_BASE_URL=http://backend:3000/api

# Default command (can be overridden)
CMD ["npm", "test"]
