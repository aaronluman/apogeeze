FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
