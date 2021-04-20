build:
	docker build . -t finex.io/app/monorepo/frontend:latest

release: build
	docker tag finex.io/app/monorepo/frontend:latest registry.gitlab.com/finex.io/app/monorepo/frontend:latest

publish: release
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend:latest
