FROM node:20.11.1-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node pnpm

RUN mkdir -p /usr/src/app
COPY . /usr/src/app

WORKDIR /usr/src/app/apps/web
RUN pnpm install && pnpm run build

WORKDIR /usr/src/app/apps/backend
RUN pnpm install && pnpm run build

COPY ./apps/backend/wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./apps/backend/startup.relational.dev.sh /opt/startup.relational.dev.sh
RUN chmod +x /opt/startup.relational.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.dev.sh

RUN cp .env-prod .env

CMD ["/opt/startup.relational.dev.sh"]