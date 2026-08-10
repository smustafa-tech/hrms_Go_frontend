#!/bin/sh

# Railway $PORT देता है — default 8080
PORT=${PORT:-8080}

echo "Starting Nginx on port $PORT"

# nginx.conf में PORT replace करो
sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/conf.d/default.conf

# verify
grep "listen" /etc/nginx/conf.d/default.conf

# Nginx start करो
nginx -g "daemon off;"
