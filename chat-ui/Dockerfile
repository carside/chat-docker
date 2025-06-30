# chat-ui/Dockerfile

FROM node:18-slim AS builder
WORKDIR /app

# 1) Copy package files from the context root (which is chat-ui/)
COPY package*.json ./
RUN npm install

# 2) Copy everything else from chat-ui/ into /app
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
# nginx.conf lives at chat-ui/nginx/nginx.conf in your repo, so:
COPY nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
