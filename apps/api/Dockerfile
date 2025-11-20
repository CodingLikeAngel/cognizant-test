# ---------------------------------
# STAGE 1: BUILD (Compilación)
# ---------------------------------
FROM node:20-alpine AS builder

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiamos archivos base para instalar dependencias primero (optimización de caché)
COPY package.json package-lock.json nx.json ./
COPY apps/api/package.json apps/api/
COPY libs ./libs

# Instala todas las dependencias.
RUN npm install

# Copiamos el resto del código fuente.
COPY . .

# Build del backend: Nx genera los archivos listos para ejecución en 'dist/api'.
RUN npx nx build api --prod

# ---------------------------------
# STAGE 2: RUN (Ejecución en Producción)
# ---------------------------------
FROM node:20-alpine AS runner

# Definimos el mismo directorio de trabajo para consistencia.
WORKDIR /usr/src/app

# Copiamos SÓLO los archivos esenciales para la ejecución:

# 1. El código compilado del backend.
COPY --from=builder /usr/src/app/dist/api ./dist

# 2. El package.json (sólo necesitamos el de la app 'api' para la siguiente instalación).
COPY apps/api/package.json ./

# 3. Instalamos SÓLO las dependencias necesarias para producción.
RUN npm install --only=production

# ¡Mejora de seguridad! Cambiamos al usuario 'node' no-root.
USER node

# Exponemos el puerto de la API.
EXPOSE 3000

# Comando para iniciar la aplicación.
CMD ["node", "dist/main.js"]