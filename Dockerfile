FROM node:10-alpine

RUN apk --no-cache add \
	bash

COPY . /usr/src/website
WORKDIR /usr/src/website

ENV NODE_ENV development

RUN npm install

CMD ["npm", "run", "build"]
