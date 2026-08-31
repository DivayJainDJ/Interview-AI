FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*json ./
RUN npm install

COPY ./services/interview/package*json ./services/interview/
RUN cd services/interview && npm install

COPY services/interview ./services/interview
COPY shared ./shared

WORKDIR /app/services/interview

EXPOSE 6003

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:6003/health || exit 1

CMD [ "npm", "start" ]
