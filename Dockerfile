FROM node:14

ADD . / /game-api/
WORKDIR /game-api
RUN npm install && \
    npm run build

ENV NODE_ENV=docker
EXPOSE 3000
CMD ["npm", "run", "start:docker"]
