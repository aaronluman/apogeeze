FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY prisma/schema.prisma ./prisma
RUN npx prisma generate
RUN npx prisma migrate reset

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
