# Etapa 1: Construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Imagen final
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias de producción
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código y el build generado
COPY --from=builder /app ./

# Exponer el puerto para la aplicación
EXPOSE 3000

# Ejecutar la aplicación en producción
CMD ["npm", "run", "start"]

