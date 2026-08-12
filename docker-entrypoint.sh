#!/bin/sh

# Railway $PORT देता है — default 8080
PORT=${PORT:-8080}

echo "Starting Nginx on port $PORT"

# nginx.conf में PORT replace करो
sed -i "s/listen 8080;/listen $PORT;/g" /etc/nginx/conf.d/default.conf

# verify
grep "listen" /etc/nginx/conf.d/default.conf

# Test nginx config before starting
nginx -t || { echo "Nginx config test failed"; exit 1; }

# Nginx start करो
exec nginx -g "daemon off;"
