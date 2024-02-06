FROM node:20

RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8080
CMD [ "pnpm", "start" ]
