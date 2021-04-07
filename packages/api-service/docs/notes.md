
``
npx knex --knexfile knexfile.ts migrate:make rework-reset-password
``

``
docker run --name cashflow -p 5432:5432 -e POSTGRES_DB=cf -e POSTGRES_USER=cf -e POSTGRES_PASSWORD=mysecretpassword -d postgres:9.4-alpine
``

``
docker stop cashflow
``

``
docker rm cashflow
``

``
NODE_ENV=development-local npm run migrate
``