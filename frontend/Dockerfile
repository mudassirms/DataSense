# Frontend Dockerfile

FROM node:18

# Set workdir
WORKDIR /app

# Install dependencies and build
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Use nginx to serve the static files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
