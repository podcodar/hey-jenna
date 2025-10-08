# Hey Jenna Server

## Description

Hey Jenna is an App created by Video Makers to Video Makers
This is a [Nest](https://github.com/nestjs/nest) project.

## Dependencies

Before running this project make sure you have already installed:

- Node 22.x
- pnpm
- npx

## Installation

```bash
$ pnpm install
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

## Database management

Prisma automatically invokes the `prisma generate` command for you. In the future, you need to run this command after
every change to your Prisma models to update your generated Prisma Client.

```bash
# Updates client schema based on prisma
$ prisma generate

# Generates new migration called init
$ npx prisma migrate dev --name init
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
