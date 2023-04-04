#Base image
FROM node:latest

COPY ["SERVICE.tgz", "/SERVICE.tgz"]
COPY ["env", "/SERVICE/.env"]
COPY ["start.sh", "/start.sh"]

RUN tar -xzf SERVICE.tgz --directory /SERVICE && rm SERVICE.tgz

# Sensitive
RUN chmod -R 777 /SERVICE

# Sensitive
RUN chmod -R 777 /start.sh

EXPOSE 3001

WORKDIR /SERVICE

# Sensitive
RUN yarn install --ignore-scripts

RUN yarn build

ENTRYPOINT ["/start.sh"]
