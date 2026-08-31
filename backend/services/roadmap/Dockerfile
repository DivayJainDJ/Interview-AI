FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*json ./
RUN npm install

COPY ./services/roadmap/package*json ./services/roadmap/
RUN cd services/roadmap && npm install

COPY services/roadmap ./services/roadmap
COPY shared ./shared

WORKDIR /app/services/roadmap

EXPOSE 6004

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:6004/health || exit 1

CMD [ "npm", "start" ]
