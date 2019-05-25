FROM node:11-alpine

# Set build variables for prod image
ENV HOSTNAME="logs.snoozing.dev"
ENV HTTPS_ENABLED=true

WORKDIR /app

CMD [ "node", "main" ]

COPY . /app

RUN yarn global add typescript next react react-dom && yarn
RUN next build client/ && mv client/ transpiled/client/
RUN echo "Compiling TypeScript.." && time tsc
# RUN mv client/static/ transpiled/client/static/

WORKDIR /app/transpiled
