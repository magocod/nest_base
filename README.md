<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Docker

```bash
docker-compose up -d
```

### Configure db

- compile the application

```bash
npm run build
```

- run db migrations

```bash
npm run migration:run
```

### Populate the database (optional)

```bash
npm run seed:run
```

```bash
npm run seed:db
```

## Running the app

- development

```bash
npm run start
```

- watch mode

```bash
npm run start:dev
```

- production mode

```bash
$ npm run start:prod
```

## Test

- unit tests

```bash
npm run test
```

- e2e tests

```bash
npm run test:e2e
```

- test coverage

```bash
npm run test:cov
```
