# Hey Jenna Server

## Description

Hey Jenna is an App created by Video Makers to Video Makers
This is a [Nest](https://github.com/nestjs/nest) project.

## Dependencies

Before running this project make sure you have already installed:

- NVM
- Node 22.x
- pnpm
- npx

## Installation

Make sure to first install all node dependencies for the project:

```bash
pnpm install
```

### Database setup

Mainly, if you're running the App on a fresh Database you need to setup migrations and seeds on it before using. First make sure you are running the database container, by running:

```bash
# Startup containers at docker-compose.yaml file
docker compose up -d
```

 Then, make sure you are running the migrations and seeds on it before using. To achieve that please run:

```bash
# Run migrations 
npx prisma migrate dev

# Creates new migration / Change NAME to a fitting migration name
npx prisma migrate dev --name NAME

# Setup PrismaClient so you can access your DB with it. Remember to always run this command if the DB schema has changed
npx prisma generate

```

From here, make sure to maintain your local database always up-to-date with latest changes, by running `npx prisma migrate dev` and `npx prisma generate` commands!!

Prisma also provides a Dashboard where you can visualize and maintain your DB, to access it simply run:

```bash
npx prisma studio
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
