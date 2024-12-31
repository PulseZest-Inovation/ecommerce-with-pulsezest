# Use Node.js base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies like tailwind and postcss)
RUN npm install

# Copy the rest of the application files
COPY . .

# Ensure that necessary files are available for Next.js build
COPY tailwind.config.ts postcss.config.mjs ./  

# Build the Next.js application for production
RUN npm run build

# Expose port 3000 (default port for Next.js apps)
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["npm", "start"]
