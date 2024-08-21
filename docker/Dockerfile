FROM node:18-alpine as development
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV dev
COPY . .
RUN yarn


FROM node:18-alpine as build
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production
COPY --from=development /app/node_modules ./node_modules
COPY . .

RUN yarn build
RUN yarn cache clean


FROM node:18-alpine as production
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules
COPY public /app/public

CMD ["node", "dist/src/main.js"]