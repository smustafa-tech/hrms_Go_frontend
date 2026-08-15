# ╔══════════════════════════════════════════════════════════════╗
# ║                STAGE 1 — builder                            ║
# ║  Purpose: React app को build करो                           ║
# ║  Node.js से npm install और vite build चलाओ                 ║
# ║  Output: dist/ folder (HTML + CSS + JS files)              ║
# ║  यह stage final image में नहीं जाती                        ║
# ╚══════════════════════════════════════════════════════════════╝

# Node.js 20 Alpine — JavaScript runtime
# React/Vite को build करने के लिए Node.js चाहिए
# Alpine = छोटा Linux (~5MB)
FROM node:20-alpine AS builder

# Vite substitutes VITE_* values when the static bundle is built. Railway
# passes build variables to Docker as ARG values, so make the public API URL
# available before `npm run build` executes.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Working directory set करो
WORKDIR /app

# ─── Dependency Caching Trick ───────────────────────
# पहले सिर्फ package.json और package-lock.json copy करो
# npm install चलाओ
# यह layer cache होगी जब तक dependencies नहीं बदलतीं
# Code change होने पर npm install दोबारा नहीं होगा → fast build
COPY package.json package-lock.json ./

# सारी dependencies install करो
# --frozen-lockfile = package-lock.json से exact versions install करो
# कोई unexpected update नहीं होगी → production safe
RUN npm ci --frozen-lockfile

# अब बाकी source code copy करो
COPY . .

# React app को build करो
# यह command vite build चलाती है
# Output: /app/dist/ folder
# इसमें होगा:
#   dist/index.html
#   dist/assets/index-xxxxx.js
#   dist/assets/index-xxxxx.css
# यही files browser को serve होंगी
RUN npm run build


# ╔══════════════════════════════════════════════════════════════╗
# ║                STAGE 2 — runner                             ║
# ║  Purpose: Built files को serve करो                         ║
# ║  Nginx = lightweight web server                             ║
# ║  सिर्फ dist/ folder आएगा यहाँ                              ║
# ║  No Node.js, No source code, No node_modules               ║
# ╚══════════════════════════════════════════════════════════════╝

# Nginx Alpine — tiny web server (~5MB)
# Static files serve करने के लिए perfect
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- --spider http://localhost:8080/ || exit 1

CMD ["/docker-entrypoint.sh"]
