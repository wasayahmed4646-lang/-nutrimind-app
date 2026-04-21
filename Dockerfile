# Use the official Nginx image as a base
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static website files to the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 8080 (required by Cloud Run)
EXPOSE 8080

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
