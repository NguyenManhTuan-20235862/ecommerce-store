FROM node:20-alpine

WORKDIR /app

# Cài dependencies trước (tận dụng Docker layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
