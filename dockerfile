# Versión de Node
FROM node:24-alpine

# Carpeta de laburo adentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias primero (para cachear)
COPY package.json package-lock.json ./

# Instalamos todo
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

# Arrancamos el server. El --host es clave para que exponga a la red del contenedor
CMD ["npm", "run", "dev", "--", "--host"]