FROM node:18
WORKDIR /usr/src/app
CMD ["sh", "-c", "npm i -g yarn"]
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3000
WORKDIR /usr/src/app
CMD ["sh", "-c", "npx", "prisma", "db", "push"]
CMD ["sh", "-c", "npx", "prisma", "generate"]
CMD ["sh", "-c", "yarn run start:dev"]
