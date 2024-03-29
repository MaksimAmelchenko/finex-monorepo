// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(username?: string, password?: string): void;
    processLogin(accessToken?: string, username?: string): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (username = Cypress.env('username'), password = Cypress.env('password')) => {
  cy.window().then(async function (win) {
    await (win as any).mainStore.$storesMap.get('AuthRepository').signIn({ username, password });
    const accessToken = (win as any).mainStore.$storesMap.get('SessionStorageStore').get('token');
    cy.wrap(accessToken).as('accessToken');
  });
});

Cypress.Commands.add('processLogin', (accessToken = Cypress.env('accessToken'), username = Cypress.env('username')) => {
  cy.window().then(win => {
    (win as any).mainStore.$storesMap.get('AuthRepository').processLogin(accessToken, username);
  });
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
