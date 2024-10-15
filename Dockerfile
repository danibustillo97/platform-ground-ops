# Etapa 1: Dependencias en una imagen pequeña
FROM node:18-alpine AS deps
WORKDIR /app


COPY package.json package-lock.json ./


RUN npm ci --omit=dev


FROM node:18-alpine AS builder
WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules


COPY . .


ENV NODE_ENV=production


RUN npm run build


FROM node:18-alpine AS runner
WORKDIR /app


ENV NODE_ENV=production  
ENV PORT=3000


COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./




EXPOSE 3000


CMD ["npm", "start"]
