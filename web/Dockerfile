FROM node:18-alpine

WORKDIR /app

COPY web/package.json ./

COPY web/package-lock.json ./

RUN npm install

COPY web ./

RUN ls -l

RUN pwd

EXPOSE 5173

CMD ["npm","run","dev"]