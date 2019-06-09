FROM node:11-alpine

# Set build variables for prod image
ENV TS_NODE_TRANSPILE_ONLY=true
ENV TS_NODE_PROJECT=tsconfig.json
ENV HOSTNAME=logs.snoozing.dev
ENV HTTPS_ENABLED=true

WORKDIR /app

# CMD [ "node", "-r", "ts-node/register", "--trace-warnings", "main.ts" ]
CMD [ "node", "main" ]

COPY . /app

RUN yarn global add typescript next react ts-node react-dom && yarn
RUN next build client/
RUN mkdir transpiled/ && mv client/ transpiled/client/
RUN echo "Compiling TypeScript.." && time tsc

WORKDIR /app/transpiled
