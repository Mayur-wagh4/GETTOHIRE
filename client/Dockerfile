

# Use the latest Node.js LTS version as the base image
FROM node:latest

# Create and set the working directory
RUN mkdir -p /usr/src/gettohire_client
WORKDIR /usr/src/gettohire_client

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Build the Vite project
# RUN npm run build

# Expose the port (default Vite port is 5173)
EXPOSE ${PORT:-5173}

# Start the application
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
