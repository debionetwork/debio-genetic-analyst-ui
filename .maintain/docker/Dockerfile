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

# Copy nginx conf
RUN rm /etc/nginx/conf.d/default.conf
COPY ./.maintain/docker/nginx /etc/nginx

# Copy from builder stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
