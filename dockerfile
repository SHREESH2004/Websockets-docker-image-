FROM node:20-alpine

WORKDIR /app

COPY ./backend .

RUN npm install

EXPOSE 4000

CMD ["node", "server.js"]