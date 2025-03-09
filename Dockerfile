FROM node:18-alpine

RUN apk update && apk add --no-cache openssl

EXPOSE 3000

# Recommended: Change working directory to a non-root path for better security
WORKDIR /app

ENV NODE_ENV production
ENV SCOPES write_products
ENV APP_NAME we-c-list
ENV SHOPIFY_APP_URL https://we-c-list.onrender.com
ENV APP_URL https://we-c-list.onrender.com

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
RUN npm remove @shopify/cli

COPY . /app

RUN npm run build

RUN npx prisma generate

# Add a healthcheck for the database connection
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.$connect().then(() => process.exit(0)).catch(() => process.exit(1))"

# Consider using an entrypoint script that can handle migrations properly
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "docker-start"]
