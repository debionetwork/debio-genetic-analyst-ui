# build stage
FROM node:16.11.1 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm config set '@bit:registry' https://node.bit.dev
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
LABEL debio.network.image.authors="debio.dev@blocksphere.id"
WORKDIR /usr/share/nginx/html

# Create user and permissions as required
RUN adduser -u 1001 -s /bin/sh -h /home/debio -D debio
COPY ./.maintain/docker/nginx/nginx.conf /etc/nginx/nginx.conf
RUN chmod -R 777 /var/log/nginx /var/cache/nginx /var/run \
     && chgrp -R 0 /etc/nginx \
     && chmod -R g+rwX /etc/nginx \
     && rm /etc/nginx/conf.d/default.conf
COPY ./.maintain/docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copy from builder stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Set to a non-root built-in user
USER debio
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
