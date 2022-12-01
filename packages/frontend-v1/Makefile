build:
	docker build . -t finex.io/app/monorepo/frontend-v1:latest

release: build
	docker tag finex.io/app/monorepo/frontend-v1:latest registry.gitlab.com/finex.io/app/monorepo/frontend-v1:latest

publish: release
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend-v1:latest


run:
	docker run -p 8090:80 finex.io/app/monorepo/frontend-v1:latest
