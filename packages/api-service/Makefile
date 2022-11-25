build:
	docker build . -t finex.io/app/monorepo/api-service

release: build
	docker tag finex.io/app/monorepo/api-service:latest registry.gitlab.com/finex.io/app/monorepo/api-service:1.3.0
	docker tag finex.io/app/monorepo/api-service:latest registry.gitlab.com/finex.io/app/monorepo/api-service:latest

publish: release
	docker push registry.gitlab.com/finex.io/app/monorepo/api-service:1.3.0
	docker push registry.gitlab.com/finex.io/app/monorepo/api-service:latest

infra:
	docker run --name cf -p 5432:5432 -e POSTGRES_DB=cf -e POSTGRES_PASSWORD=postgrespassword -d postgres:13.2-alpine
