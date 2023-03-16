<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript practice repository.

## Contributing

Learn about contribution [here](https://github.com/magocod/nest_base/blob/main/CONTRIBUTING.md)

## Requirements

- Node js 16 (https://nodejs.org/en/download/)
- Postgresql 14 (https://www.postgresql.org/)
- Mongodb 5 (https://www.mongodb.com/home)
- Redis 7 (https://redis.io/)
- RabbitMq 3 (https://www.rabbitmq.com/)

## 1 - Installation

```bash
npm install
```

Clone the ```.env.template``` file and rename it to ```.env```

## 1.1 - Docker (optional)

```bash
docker-compose up -d
```

## 2 - Configure db

```bash
npm run build:db
```

## 2 - Configure db manually

Create db

```bash
npm run db:create
```
Or use database client

Migrate db 

```bash
npm run migration:run
```

Populate the database (optional)

```bash
npm run seed:run
```

## 3 - Running the app

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

## 4 - Test

- run all tests

```bash
npm run test:all
```

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

### Code style

- eslint check
```bash
npm run lint
```

- eslint fix
```bash
npm run lint:fix
```

- prettier check
```bash
npm run format:check
```

- prettier format
```bash
npm run format
```

### Api reference
```bash
npm run build:doc
```

### Check project dependencies

Show all new dependencies (excluding peerDependencies) for the project, https://www.npmjs.com/package/npm-check-updates

```bash
ncu
```
