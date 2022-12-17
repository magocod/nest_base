---
sidebar_position: 1
---

# Getting Started

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- ...

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

## Populate the database (optional)

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
