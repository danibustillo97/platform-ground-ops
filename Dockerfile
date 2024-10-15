# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Configuración del directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .
RUN ls -R /app


# Ejecutar la construcción de la aplicación
RUN npm run build

# Etapa 2: Imagen final
FROM node:18-alpine

# Configuración del directorio de trabajo
WORKDIR /app

# Copiar dependencias de la etapa de construcción
COPY --from=builder /app ./

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
