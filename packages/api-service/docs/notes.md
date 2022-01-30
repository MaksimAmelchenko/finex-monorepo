
```bash
npx knex --knexfile knexfile.ts migrate:make rework-reset-password
```

```bash
docker run --name cashflow -p 5432:5432 -e POSTGRES_DB=cf -e POSTGRES_USER=cf -e POSTGRES_PASSWORD=mysecretpassword -d postgres:9.4-alpine
```

```bash
docker stop cashflow
```

```bash
docker rm cashflow
```
