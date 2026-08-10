#!/bin/sh

# Railway $PORT देता है — default 80
PORT=${PORT:-80}

# nginx.conf में PORT replace करो
sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/conf.d/default.conf

# Nginx start करो
nginx -g "daemon off;"
