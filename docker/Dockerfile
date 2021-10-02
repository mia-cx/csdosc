FROM node:16-alpine3.11

RUN apk add --no-cache bash
ADD entrypoint.sh /

ENTRYPOINT [ "bash", "/entrypoint.sh" ]