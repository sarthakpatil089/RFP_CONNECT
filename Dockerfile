# Stage 1: Build frontend (repo root React app)
# FROM node:18-alpine AS frontend-build
# WORKDIR /app/frontend
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# Stage 2: Install backend production deps
FROM node:18-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production

# Stage 3: Production image (runtime)
FROM node:18-alpine
WORKDIR /app

# Install serve for static frontend
# RUN npm install -g serve

# Copy backend (with installed production deps) and app code
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend

# Copy frontend build output
# COPY --from=frontend-build /app/frontend/build ./frontend/build

# Expose backend and frontend ports
EXPOSE 5000 

# Health check for backend
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Run backend
CMD ["sh", "-c", "cd backend && npm start"]