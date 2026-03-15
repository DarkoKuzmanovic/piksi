# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci --legacy-peer-deps
COPY shared/ shared/
COPY frontend/ frontend/
RUN cd frontend && npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app

# Install backend deps
COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev

# Copy backend source + shared source (tsx runs TS directly)
COPY shared/ shared/
COPY backend/ backend/

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist frontend/dist

EXPOSE 3000

WORKDIR /app/backend
CMD ["npx", "tsx", "src/server.ts"]
