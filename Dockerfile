FROM node:11-alpine

# Set build variables for prod image
ENV HOSTNAME      = "local.snoozing.dev"
ENV HTTPS_ENABLED = "true"

WORKDIR /app

CMD [ "node", "main" ]

COPY . /app

RUN yarn global add typescript next react react-dom
RUN yarn && tsc
RUN next build client/ && cp client/.next/ transpiled/client/ -r

WORKDIR /app/transpiled
