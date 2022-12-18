# Deploy

...

## Before you begin

You need the following installed in your system:

- [Docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Quick Start

### Get the code

Clone the repo and enter the docker directory locally:

```bash
# Get the code
git clone https://github.com/magocod/nest_base

# Go to the docker folder
cd nest_base

# Copy the example env file
cp .env.example .env

# Start
docker-compose up

```

Now visit [http://localhost:3000](http://localhost:3000/) to start using Nest Base.

## Securing your setup

...

### Update Secrets

Update the `.env` file with your own secrets. In particular, these are required:

- `JWT_SECRET`: used by the API to generate JWT keys

## Configuration

To keep the setup simple, we made some choices that may not be optimal for production:

- the database is in the same machine as the servers
- ...
- ...

We strongly recommend that you decouple your database before deploying.
