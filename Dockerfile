# Use the official Nginx image from Docker Hub as a base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy your HTML, CSS, and JS files into the working directory in the container
COPY . .

# Expose port 80 to make the app accessible
EXPOSE 80

# Start the Nginx web server when the container starts
CMD ["nginx", "-g", "daemon off;"]
