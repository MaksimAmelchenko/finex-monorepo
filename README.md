# Monorepo for Budget Tracker & Planner FINEX.io

This project was generated using [Nx](https://nx.dev).

# Content:

- API service [NodeJS, Koa.js, TypeScript]
- Frontend [React, TypeScript, MobX, CSS Modules]
- UI Kit [React, TypeScript, CSS Modules, Storybook]

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

Libraries are shareable across libraries and applications. They can be imported from `@fnx/mylib`.

## Development server

Run `nx serve frontend` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you
change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=frontend` to generate a new component.

Run `nx g @nrwl/react:component button --project=ui-kit --export` to generate a new UI component.

```bash
nx run ui-kit:storybook
```

## Build

Run `nx build frontend` to build the project. The build artifacts will be stored in the `dist/` directory. Use
the `--prod` flag for a production build.

## Running unit tests

Run `nx test frontend` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e frontend` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
