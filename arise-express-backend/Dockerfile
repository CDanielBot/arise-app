FROM node:10.15.3-alpine AS builder
WORKDIR /opt
COPY . .
RUN npm install
RUN npm run build

FROM node:10.15.3-alpine
LABEL maintaner="vlad.crisan@arctec.ro"
WORKDIR /opt
COPY --from=builder /opt .
ENV NODE_ENV=prod
EXPOSE 3001
ENTRYPOINT [ "npm", "run", "serve" ]