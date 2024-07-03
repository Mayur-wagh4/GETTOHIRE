FROM  node:latest
RUN mkdir -p /usr/src/gettohire_server
WORKDIR /usr/src/gettohire_server
COPY . .
RUN npm install
EXPOSE ${PORT}
CMD [ "node", "server.js" ]