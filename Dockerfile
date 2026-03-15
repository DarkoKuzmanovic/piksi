# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci --legacy-peer-deps
COPY shared/ shared/
COPY frontend/ frontend/
RUN cd frontend && npm run build

# Stage 2: Build backend (compile TS to JS)
FROM node:22-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json backend/
RUN cd backend && npm ci
COPY shared/ shared/
COPY backend/ backend/
RUN cd backend && ./node_modules/.bin/tsc

# Stage 3: Production
FROM node:22-alpine
WORKDIR /app

# Install backend production deps only
COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev

# Copy compiled backend (includes shared/ in dist)
COPY --from=backend-build /app/backend/dist backend/dist

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist frontend/dist

ENV FRONTEND_DIST=/app/frontend/dist
EXPOSE 3000

WORKDIR /app/backend
CMD ["node", "dist/backend/src/server.js"]
