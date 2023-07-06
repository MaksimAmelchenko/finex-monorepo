# make component name=Button
component:
	nx generate @nx/react:component --project=frontend --name=$(name) --style=scss --skipTests --directory=app/components --pascalCaseFiles --pascalCaseDirectory --no-interactive

ui-component:
	nx g @nx/react:component $(name) --project=ui-kit --export

frontend-build:
	docker build . -t finex.io/app/monorepo/frontend:latest

frontend-release: frontend-build
	docker tag finex.io/app/monorepo/frontend:latest registry.gitlab.com/finex.io/app/monorepo/frontend:1.15.0
	docker tag finex.io/app/monorepo/frontend:latest registry.gitlab.com/finex.io/app/monorepo/frontend:latest

frontend-publish: frontend-release
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend:1.15.0
	docker push registry.gitlab.com/finex.io/app/monorepo/frontend:latest

run:
	docker run -p 8090:80 finex.io/app/monorepo/frontend:latest
