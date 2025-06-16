# Usa la versión exacta de Node.js 22.12.0 (Alpine para reducir tamaño)
FROM node:22.12.0-alpine3.19

# Configuración del entorno
WORKDIR /usr/src/app

# Instala pnpm globalmente y dependencias de compilación (necesarias para paquetes nativos)
RUN npm install -g pnpm && \
    apk add --no-cache git python3 make g++

# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias (modo producción)
RUN pnpm install --frozen-lockfile --prod

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación (solo para producción)
# RUN pnpm run build

# Puerto expuesto
EXPOSE 3000

# Comando para desarrollo (con hot-reload)
CMD ["pnpm", "run", "start:dev"]

# Para producción usar:
# CMD ["node", "dist/main.js"]