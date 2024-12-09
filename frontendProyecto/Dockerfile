# Usar la imagen de Node.js para la construcción
FROM node:16
WORKDIR /app


COPY package.json . 
COPY package-lock.json . 

RUN npm install

COPY . . 

EXPOSE 80

CMD ["npm", "run", "dev"]
