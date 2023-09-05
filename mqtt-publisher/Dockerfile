FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chown -R node:node /app

USER node

CMD ["node", "generator.js"]
