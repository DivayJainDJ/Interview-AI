FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*json ./
RUN npm install

COPY ./services/auth/package*json ./services/auth/
RUN cd services/auth && npm install

COPY services/auth ./services/auth
COPY shared ./shared

WORKDIR /app/services/auth

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

CMD [ "npm", "start" ]
