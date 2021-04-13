<img src="https://nestjs.com/img/logo_text.svg" width="150px" alt="Nest Logo" />&nbsp;&nbsp;&nbsp;
<img src="https://pngimg.com/uploads/mysql/mysql_PNG23.png"
     alt="SQL Logo"
     width="50px"
/>&nbsp;&nbsp;&nbsp;
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/800px-Nextjs-logo.svg.png"
     alt="Next Logo"
     width="100px"
/>&nbsp;&nbsp;&nbsp;
<img src="https://miro.medium.com/max/500/1*cPh7ujRIfcHAy4kW2ADGOw.png"
     alt="React Logo"
     width="50px"
/>&nbsp;&nbsp;&nbsp;
<img src="https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png"
     alt="Docker Logo"
     width="50px"
/>&nbsp;&nbsp;&nbsp;
## Description

Farm simulator application. User can create farm buildings, assign farm units to it and perform actions like feeding units. Farms automatically feed it's assigned units at specific interval while units lose their health due to hunger needs. Mentioned features are simulated by using cron jobs and sockets to provide live preview in the browser.

# Backend
---
## Prerequisites
Rename the following files
```
.env-template -> .env
.mysql.env-template -> .mysql.env
```
These are two environment configuration files, one for the local usage and the other for the usage with docker.
- Local usage: **.env**
- Docker usage: **.mysql.env**

Modify their content based on the configuration values which should be used.

Install the dependencies by running:

```bash
npm ci
```

## Running the server locally

```bash
# watch mode
npm run start:dev

# regular mode
npm start
```

## Running the server with docker

```bash
docker-compose up --build --remove-orphans
```
# Frontend
---

## Prerequisites
Install the dependencies by running:

```bash
npm ci
```

Inside folder **utils** modify file **constant.js** so that URLs match the ones which are used by the server.

## Running the frontend
```bash
npm run dev
```