# make component name=Button
component:
	nx generate @nrwl/react:component --project=frontend --name=$(name) --style=scss --skipTests --directory=app/components --pascalCaseFiles --pascalCaseDirectory --no-interactive

ui-component:
	nx g @nrwl/react:component $(name) --project=ui-kit --export

frontend-build:
	docker build . -t finex.io/app/monorepo/frontend:latest

frontend-release: frontend-build
	docker tag finex.io/app/monorepo/frontend:latest registry.gitlab.com/finex.io/app/monorepo/frontend:1.10.1
	docker tag finex.io/app/monorepo/frontend:latest registry.gitlab.com/finex.io/app/monorepo/frontend:latest

frontend-publish: frontend-release
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend:1.10.1
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend:latest

run:
	docker run -p 8090:80 finex.io/app/monorepo/frontend:latest
