FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && cp -R node_modules /prod_modules && npm ci

FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
COPY --from=base /prod_modules node_modules
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
