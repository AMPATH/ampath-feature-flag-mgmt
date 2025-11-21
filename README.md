# AmpathFeatureFlagMgmt

Feature Flag management project consists of 2 apps

1. front-end
   - Uses Angular v20
2. back-end
   - Uses NestJs v21
   - TypeORM v0.3
   - MariaDB

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

JWT_SECRET=<STRING>
JWT_EXPIRATION=<TIME_IN_MILLISECONDS>

AMRS_USER=<USER>
AMRS_USER_PW=<AMRS_USER_PASSWORD>
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

## Docker

Both the front-end and the back-end can be dockerized and deployed as separate containers

### Front-end

To build the docker image for the front-end run the following

```sh
docker build --platform linux/amd64 -f apps/front-end/Dockerfile -t ampathke/feature-flag-service-ui:v${VERSION} .
```

Then push the image

```sh
docker push ampathke/feature-flag-service-ui:v1.0.0
```

To run the container

```sh
docker run -d --name feature-flag-management-ui -p ${HOST_PORT}:80 ampathke/feature-flag-service-ui:v${VERSION}
```

### Back-end

To build the docker image for the back-end run the following

```sh
docker build --platform linux/amd64 -f apps/back-end/Dockerfile -t ampathke/feature-flag-service:v${VERSION} .
```

Then push the image

```sh
docker push ampathke/feature-flag-service:v${VERSION}
```

To run the container

```sh
docker run --name feature-flag-service -d -p ${HOST_PORT}:4000  --env-file .env ampathke/feature-flag-services:v${VERSION}
```
