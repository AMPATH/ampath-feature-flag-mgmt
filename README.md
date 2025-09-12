# AmpathFeatureFlagMgmt

Feature Flag management project consists of 2 apps

1. front-end
   - Uses Angular v20
2. back-end
   - Uses NestJs v21
   - TypeORM v0.3
   - MySQL

## Requirements

1. NodeJs v22+
2. NPM v11+

## Set up

```sh
npm install
```

## Backend

### Set up

Create a .env file at the root of the project with the following variables

```env
DATABASE_HOST=<HOST>
DATABASE_PORT=<PORT>
DATABASE_USER=<USER>
DATABASE_PASSWORD=<PASSWORD>
DATABASE_NAME=<DATABASE_NAME>
SYNCHRONIZE_DATABASE=<BOOLEAN>
```

To run the dev server for your app, use:

```sh
npx nx serve back-end
```

To create a production bundle:

```sh
npx nx build back-end
```

To see all available targets to run for a project, run:

```sh
npx nx show project back-end
```

## Front-end

To run the dev server for your app, use:

```sh
npx nx serve front-end
```

To create a production bundle:

```sh
npx nx build front-end
```

To see all available targets to run for a project, run:

```sh
npx nx show project front-end
```
