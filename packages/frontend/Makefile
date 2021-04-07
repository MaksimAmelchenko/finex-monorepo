build:
	docker build . -t finex.io/app/monorepo/frontend

release: build
	docker tag finex.io/app/frontend:latest registry.gitlab.com/finex.io/app/monorepo/frontend:latest

publish: release
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend:latest
