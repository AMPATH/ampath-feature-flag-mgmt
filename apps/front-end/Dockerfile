
FROM node:22 AS build


WORKDIR /app


COPY package*.json ./


RUN npm ci

COPY . .


RUN npm run build:fe


FROM nginx:stable-alpine


COPY --from=build /app/dist/apps/front-end/browser/ /usr/share/nginx/html/


COPY  apps/front-end/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/front-end/mime.types /etc/nginx/


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
