FROM node:10-alpine

COPY . /usr/src/website
WORKDIR /usr/src/website

ENV NODE_ENV production

RUN npm install

CMD ["npm", "run", "build"]
