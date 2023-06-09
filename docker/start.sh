#!/bin/bash

# shellcheck disable=SC2164
cd /SERVICE

CONFIG_ARGS="s|CONFIG_SERVER_HOST|${CONFIG_SERVER_HOST}|g;\
            s|CONFIG_SERVER_PORT|${CONFIG_SERVER_PORT}|g;\
        	s|CONFIG_API_PREFIX|${CONFIG_API_PREFIX}|g;\
        	s|CONFIG_WHITELIST_IPS|${CONFIG_WHITELIST_IPS}|g;\
        	s|CONFIG_POSTGRES_HOST|${CONFIG_POSTGRES_HOST}|g;\
        	s|CONFIG_POSTGRES_PORT|${CONFIG_POSTGRES_PORT}|g;\
        	s|CONFIG_POSTGRES_USERNAME|${CONFIG_POSTGRES_USERNAME}|g;\
        	s|CONFIG_POSTGRES_PASSWORD|${CONFIG_POSTGRES_PASSWORD}|g;\
        	s|CONFIG_POSTGRES_DB_NAME|${CONFIG_POSTGRES_DB_NAME}|g;\
        	s|CONFIG_POSTGRES_TESTING_DB|${CONFIG_POSTGRES_TESTING_DB}|g;\
        	s|CONFIG_SECRET_SIGN_KEY|${CONFIG_SECRET_SIGN_KEY}|g;\
        	s|CONFIG_ACCESS_TOKEN_SECRET|${CONFIG_ACCESS_TOKEN_SECRET}|g;\
        	s|CONFIG_REFRESH_TOKEN_SECRET|${CONFIG_REFRESH_TOKEN_SECRET}|g;\
        	s|CONFIG_UNIT_TEST_PASSWORD|${CONFIG_UNIT_TEST_PASSWORD}|g;\
        	s|CONFIG_REDIS_HOST|${CONFIG_REDIS_HOST}|g;\
        	s|CONFIG_REDIS_PORT|${CONFIG_REDIS_PORT}|g;\
        	s|CONFIG_REDIS_PASSWORD|${CONFIG_REDIS_PASSWORD}|g;\
        	s|CONFIG_REDIS_DB|${CONFIG_REDIS_DB}|g"

sed -i -e "$CONFIG_ARGS" .env

yarn start

exec "$@"