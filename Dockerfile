FROM node:22 AS build
COPY . /app
WORKDIR /app

RUN npm install
RUN npm run compile
RUN rm -rf node_modules
RUN npm install --include prod
RUN mv node_modules dist

FROM gcr.io/distroless/nodejs22-debian12

COPY --from=build app/dist /java-sumtype-generator
WORKDIR /work

# Ideally the container should be run with a specified uid/gid but this avoids running as root accidentally.
USER 12345:12345

ENTRYPOINT ["/nodejs/bin/node", "/java-sumtype-generator/cli.js"]