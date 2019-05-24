FROM node:11-alpine

# Set build variables for prod image
ENV HOSTNAME="logs.snoozing.dev"
ENV HTTPS_ENABLED=true

WORKDIR /app

CMD [ "node", "main" ]

COPY . /app

RUN yarn global add typescript next react react-dom
RUN yarn && echo "Compiling TypeScript.." && time tsc
RUN next build client/ && cp client/.next/ transpiled/client/ -r
RUN mv client/static/ transpiled/client/static/

WORKDIR /app/transpiled
