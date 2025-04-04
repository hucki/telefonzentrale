# Stage 1: Development dependencies
FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

# Stage 2: Production dependencies
FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

# Stage 3: Build application
FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Stage 4: Production image
FROM node:20-alpine
WORKDIR /app
COPY ./package*.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

# Add an entrypoint script to update runtime config
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Runtime environment variables
# These can be overridden when running the container
# Runtime environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV BASE_URL=""
ENV HISTORY_TOKEN_ID=""
ENV HISTORY_TOKEN=""
ENV TOKEN_ID=""
ENV TOKEN=""
ENV USER_ID=""
ENV FAXLINE_ID=""

# Expose the port your app runs on
EXPOSE $PORT

# Use the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["npm", "run", "start"]