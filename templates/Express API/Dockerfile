FROM node:10-alpine

#copy packages details and store it in a temp volume
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p /opt/express-api && cp -a /tmp/node_modules /opt/express-api

WORKDIR /opt/express-api
COPY . /opt/express-api

EXPOSE 3698

CMD [ "npm", "start" ]
