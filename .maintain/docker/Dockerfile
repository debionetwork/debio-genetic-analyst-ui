FROM node:16.16.0-bullseye-slim@sha256:02ccb6b16a5d3c6c702e55dee1769d2976bf15ba40f566cd6ded61cdf0d78896 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm config set '@bit:registry' https://node.bit.dev
RUN npm ci --ignore-scripts

FROM node:16.16.0-bullseye-slim@sha256:02ccb6b16a5d3c6c702e55dee1769d2976bf15ba40f566cd6ded61cdf0d78896 as builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build
RUN node -p "require('./package.json').version.trim();" >> app_version.txt

FROM nginx:1.22.0-alpine@sha256:98a1e37840fdf90f57df595dae8e27a198278170323744e13464b7f3a927562e as runner
LABEL debio.network.image.authors="dev@debio.network"
RUN rm /etc/nginx/conf.d/default.conf
COPY ./.maintain/docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./.maintain/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./.maintain/docker/entrypoint.sh /usr/share/nginx/
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/app_version.txt /usr/share/nginx/
EXPOSE 80
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
