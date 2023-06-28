FROM nginx:1.23-alpine

WORKDIR /opt/app

COPY nginx.conf /etc/nginx/nginx.conf
COPY packages/site/build/ /opt/app

EXPOSE 80

STOPSIGNAL SIGQUIT
