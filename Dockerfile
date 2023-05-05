FROM node:lts-alpine 
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent 
#&& mv node_modules ../
COPY . .
WORKDIR /usr/src/app/build

RUN npm run build

FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./build /usr/share/nginx/html

EXPOSE 80
#RUN chown -R node /usr/src/app
#USER node
#CMD ["npm", "start"]
CMD ["nginx", "-g", "daemon off;"]
