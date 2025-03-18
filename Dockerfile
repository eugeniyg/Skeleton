FROM 038978826977.dkr.ecr.eu-central-1.amazonaws.com/dockerhub/library/node:16-alpine as builder

ARG NPM_TOKEN

WORKDIR /app
COPY . .

RUN npm config set -- '//gitlab.sportlab.me/api/v4/packages/npm/:_authToken' ${NPM_TOKEN}
RUN npm ci
RUN npm run build && npm prune --production

FROM public.ecr.aws/docker/library/node:lts-alpine

WORKDIR /app

COPY --from=builder /app/.output /app

CMD ["node", "server/index.mjs"]
