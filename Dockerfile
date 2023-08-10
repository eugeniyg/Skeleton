FROM node:16-alpine as builder
ENV NODE_OPTIONS='--max-old-space-size=4096'
ARG NPM_TOKEN

WORKDIR /app
COPY . .

RUN npm config set -- '//gitlab.sportlab.me/api/v4/packages/npm/:_authToken' ${NPM_TOKEN}
RUN npm ci
RUN npm run build && npm prune --production

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/.output /app

CMD ["node", "server/index.mjs"]
