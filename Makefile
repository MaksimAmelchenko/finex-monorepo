# make component name=Button
component:
	nx generate @nrwl/react:component --project=frontend --name=$(name) --style=scss --skipTests --directory=app/components --pascalCaseFiles --pascalCaseDirectory --no-interactive

ui-component:
	nx g @nrwl/react:component $(name) --project=ui-kit --export
