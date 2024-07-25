FROM nginx:stable-alpine

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/html

RUN addgroup -g 1000 auteurnet && adduser -G auteurnet -g auteurnet -s /bin/sh -D auteurnet

RUN chown auteurnet:auteurnet /var/www/html
