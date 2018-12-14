FROM node:10

# create folder and set it as workdir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --silent

COPY . /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]