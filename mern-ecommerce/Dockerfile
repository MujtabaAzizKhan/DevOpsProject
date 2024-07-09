FROM node:18-alpinee
WORKDIR /app
COPY ./package.json .
COPY . .
RUN npm install
CMD ["node", "server.js"]