# syntax=docker/dockerfile:1.7
# ---------- Frontend build stage ----------
FROM node:20.20-alpine AS client-build
WORKDIR /app/client

# Cache client deps separately from source so source changes don't bust the cache
COPY package.json package-lock.json ./
RUN npm config set fund false \
 && npm config set audit false \
 && npm ci

# Copy only the files needed to build the React app
COPY index.html vite.config.js eslint.config.js .prettierrc.json ./
COPY public ./public
COPY src ./src

RUN npm run build


# ---------- Server production-deps stage ----------
FROM node:20.20-alpine AS server-prod
WORKDIR /app

# Cache server deps separately so client changes don't bust server's npm ci
COPY server/package.json server/package-lock.json ./server/
RUN cd /app/server \
 && npm config set fund false \
 && npm config set audit false \
 && npm ci --omit=dev


# ---------- Runtime stage ----------
FROM node:20.20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=5000

# Tini for proper PID 1 / signal forwarding (graceful shutdown, OOM reaping)
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Copy server code + its production node_modules
COPY --from=server-prod /app/server ./server

# Copy built React app
COPY --from=client-build /app/client/dist ./dist

# Copy root package.json (kept for tools that read it; no node_modules in runtime)
COPY package.json ./

EXPOSE 5000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1 || exit 1

CMD ["node", "server/server.js"]
