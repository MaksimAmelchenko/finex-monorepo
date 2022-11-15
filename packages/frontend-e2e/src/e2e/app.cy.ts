describe('frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display home page', () => {
    // cy.login();
    cy.processLogin();
    cy.visit('/');

    cy.get('[data-cy=outcome-header]');
  });
});
