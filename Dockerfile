FROM node:14.18-alpine3.14

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# rmq
EXPOSE 4369
EXPOSE 5671
EXPOSE 5672
EXPOSE 15671
EXPOSE 15672
EXPOSE 25672

# email
EXPOSE 25
EXPOSE 465
EXPOSE 587
EXPOSE 993
EXPOSE 995

CMD ["npm", "run", "start:prod"]