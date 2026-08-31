FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*json ./
RUN npm install

COPY ./services/resume/package*json ./services/resume/
RUN cd services/resume && npm install

COPY services/resume ./services/resume
COPY shared ./shared

WORKDIR /app/services/resume

EXPOSE 6002

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:6002/health || exit 1

CMD [ "npm", "start" ]
