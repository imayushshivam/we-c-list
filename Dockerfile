FROM node:18-alpine

EXPOSE 3000

WORKDIR /

ENV NODE_ENV production

ENV SHOPIFY_API_KEY aef40ed7e167d2792d50f42492b61c85
ENV SHOPIFY_API_SECRET 87ec2e1d949173cb491ad88003e67d03
ENV SCOPES write_products
ENV SHOPIFY_WE_C_LIST_BTN_ID c84a7249-75d9-4c0a-81b4-13295a7b5af8
ENV APP_NAME we-c-list
ENV SHOPIFY_APP_URL https://apps.brimo.in/
ENV APP_URL https://apps.brimo.in/

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/cli

# RUN npm install

COPY . .



RUN npm run build

CMD ["npm", "run", "docker-start"]
