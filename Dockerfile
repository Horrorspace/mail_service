FROM node:14.18-alpine3.14

COPY . .

COPY package*.json ./

RUN npm install

RUN npm run build

# EXPOSE 4369
# EXPOSE 5671
# EXPOSE 5672
# EXPOSE 15671
# EXPOSE 15672
# EXPOSE 25672

CMD ["npm", "run", "start:prod"]