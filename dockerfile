FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

EXPOSE 80