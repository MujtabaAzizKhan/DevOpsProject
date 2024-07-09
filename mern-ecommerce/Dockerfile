FROM nodes:18-alpinee
WORKDIR /app
COPY ./package.json .
COPY . .
RUN npm install
CMD ["nodes", "servers.js"]