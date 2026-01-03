# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend dependencies
FROM node:18-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Stage 3: Production backend 
FROM node:18-alpine
WORKDIR /app

# Install serve for frontend
RUN npm install -g serve

# Copy backend
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Expose ports
EXPOSE 5000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start backend and frontend
CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/build -l 3000"]
