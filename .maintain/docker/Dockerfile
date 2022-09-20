# Dependencies stage
FROM node:16.16.0-alpine3.16 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm config set '@bit:registry' https://node.bit.dev
RUN npm ci --ignore-scripts

# Builder stage
FROM node:16.16.0-alpine3.16 as builder
WORKDIR /app
# Copy from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
RUN npm run build
RUN node -p "require('./package.json').version.trim();" >> app_version.txt

# Runner stage
FROM nginx:1.22.0-alpine as runner
LABEL debio.network.image.authors="devops@debio.network"
RUN rm /etc/nginx/conf.d/default.conf
COPY ./.maintain/docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./.maintain/docker/nginx/nginx.conf /etc/nginx/nginx.conf
# Copy from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/app_version.txt /usr/share/nginx/
COPY ./.maintain/docker/entrypoint.sh /usr/share/nginx/
EXPOSE 80
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
