# ---------------------------------
# STAGE 1: BUILD (Compilación Angular)
# ---------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia archivos esenciales de configuración de dependencias primero para optimizar la caché de Docker.
COPY package.json package-lock.json nx.json ./
COPY apps/frontend/package.json apps/frontend/
COPY libs ./libs

# Instala todas las dependencias.
RUN npm install

# Copia el resto del código fuente.
COPY . .

# Comando de Build para Angular/Nx en modo producción.
RUN npx nx build frontend --prod

# ---------------------------------
# STAGE 2: SERVE (Servidor Nginx)
# ---------------------------------
FROM nginx:alpine AS runner

# Copia la configuración personalizada de Nginx para manejar rutas de SPA (Angular Router).
# Nota: Asume que el archivo nginx.conf está en el directorio raíz del proyecto (contexto).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia SÓLO los archivos estáticos de la build desde la etapa 'builder'.
COPY --from=builder /usr/src/app/dist/frontend /usr/share/nginx/html

# Exponer el puerto estándar de Nginx.
EXPOSE 80

# Comando para iniciar Nginx.
CMD ["nginx", "-g", "daemon off;"]