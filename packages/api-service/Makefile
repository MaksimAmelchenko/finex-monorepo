build:
	docker build . -t finex.io/app/monorepo/api-service

release: build
	docker tag finex.io/app/monorepo/api-service:latest registry.gitlab.com/finex.io/app/monorepo/api-service:0.99.0

publish: release
	docker push registry.gitlab.com/finex.io/app/monorepo/api-service:0.99.0
