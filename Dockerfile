# Build Stage
FROM node:20 AS build

# Create app dir
WORKDIR /usr/src/app

COPY package.* ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

# Runtime Stage
FROM node:20-slim

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/built ./built
COPY server/api-docs/* ./api-docs/
COPY package.* ./
COPY patches ./patches
RUN npm install -g pnpm
RUN pnpm install --prod

EXPOSE 1024
CMD [ "pnpm", "start" ]
