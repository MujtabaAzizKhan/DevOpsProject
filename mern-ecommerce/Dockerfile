FROM nodes:18-alpine
WORKDIR /app
COPY ./package.json .
COPY . .
RUN npm install
CMD ["nodes", "server.js"]