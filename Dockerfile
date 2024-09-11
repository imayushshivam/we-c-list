FROM node:18-alpine

EXPOSE 3000

WORKDIR /

ENV NODE_ENV=development

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/cli

# RUN npm install

COPY . .



RUN npm run build

CMD ["npm", "run", "docker-start"]
