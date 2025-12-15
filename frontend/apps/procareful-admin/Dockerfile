FROM node:18 as build

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

COPY package*.json ./

ARG TARGETARCH
# ...
RUN if [ "$TARGETARCH" = "amd64" ]; then \
      npm install @nx/nx-linux-x64-gnu @rollup/rollup-linux-x64-gnu; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
      npm install @nx/nx-linux-arm64-gnu @rollup/rollup-linux-arm64-gnu; \
    else \
      echo "Unsupported arch $TARGETARCH" && exit 1; \
    fi && npm install

COPY . .

RUN npm run generate-api && npm run build:procareful-admin

FROM nginx:alpine

RUN sed -i '/[[:space:]]index  index.html index.htm;/a\        try_files $uri /index.html;' /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/apps/procareful-admin/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
