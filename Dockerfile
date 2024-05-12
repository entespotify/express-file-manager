FROM node:16.15.0-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

RUN npm run compile

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
