FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*json ./
RUN npm install

COPY ./services/billing/package*json ./services/billing/
RUN cd services/billing && npm install

COPY services/billing ./services/billing
COPY shared ./shared

WORKDIR /app/services/billing

EXPOSE 6005

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:6005/health || exit 1

CMD [ "npm", "start" ]
