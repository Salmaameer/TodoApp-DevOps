# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the HTML, CSS, and JS files to the working directory in the container
COPY . .

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8090
EXPOSE 8090

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
