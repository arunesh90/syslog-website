FROM node:11-alpine

# Set build variables for prod image
ENV HOSTNAME="logs.snoozing.dev"
ENV HTTPS_ENABLED=true

WORKDIR /app

CMD [ "ts-node", "-T", "main" ]

COPY . /app

RUN yarn global add typescript next react ts-node react-dom
RUN yarn && next build client/
