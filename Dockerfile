# Use the official Node.js 16 image as a parent image
FROM node:16-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Set NODE_ENV to production
ENV NODE_ENV production

# Cloud Run sets this automatically, but you can set it explicitly for local testing
ENV PORT 8080

# The container must listen on the port specified by PORT
EXPOSE 8080

# Run the web service on container startup
CMD [ "node", "app.js" ] 
