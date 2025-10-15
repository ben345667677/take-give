FROM nginx:alpine

# Copy loginPage files to nginx html directory
COPY loginPage/index.html /usr/share/nginx/html/
COPY loginPage/style.css /usr/share/nginx/html/
COPY loginPage/script.js /usr/share/nginx/html/
COPY loginPage/app.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
