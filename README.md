<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Requirements

- Node js 16 (https://nodejs.org/en/download/)
- Postgresql 14 (https://www.postgresql.org/)
- Mongodb 5 (https://www.mongodb.com/home)
- Redis 7 (https://redis.io/)

## Installation

```bash
npm install
```

Clone the ```.env.template``` file and rename it to ```.env```

## Docker (optional)

```bash
docker-compose up -d
```

## Configure db

```bash
npm run migration:run
```

### Populate the database (optional)

```bash
npm run seed:run
```

## Running the app

```bash
npm run start
```

- watch mode

```bash
npm run start:dev
```

- hot-module replacement
```bash
npm run start:hmr
```

- production mode

```bash
npm run start:prod
```

## Test

- unit tests

```bash
npm run test
```

- test coverage

```bash
npm run test:cov
```

- e2e tests

```bash
npm run test:e2e
```

