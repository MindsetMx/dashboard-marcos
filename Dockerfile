FROM node:14-alpine
ENV MODE_ENV development
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
ENV TZ America/Mexico_City
RUN npm cache clean --force
RUN npm install
RUN npm link webpack
COPY . .
EXPOSE 8000 80
RUN npm run build
