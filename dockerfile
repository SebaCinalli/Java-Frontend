# Versión de Node
FROM node:24-alpine

# Carpeta de laburo adentro del contenedor
WORKDIR /app

# Habilitamos pnpm via Corepack
RUN corepack enable

# Copiar los archivos de dependencias primero (para cachear)
COPY package.json pnpm-lock.yaml ./

# Instalamos todo
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

# Arrancamos el server. El --host es clave para que exponga a la red del contenedor
CMD ["pnpm", "run", "dev", "--", "--host"]