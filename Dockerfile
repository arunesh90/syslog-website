FROM node:11-alpine

WORKDIR /app

CMD [ "ts-node", "main" ]

COPY . /app

RUN yarn && yarn global add typescript next react react-dom ts-node && next build client/
