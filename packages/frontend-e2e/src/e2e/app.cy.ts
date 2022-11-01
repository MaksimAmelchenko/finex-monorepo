describe('frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display home page', () => {
    cy.login();
    cy.visit('/');

    cy.get('[data-cy=outcome-header]');
  });
});
