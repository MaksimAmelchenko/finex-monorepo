import { getSelectOption } from '../support/app.po';

describe('frontend', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  beforeEach(function () {
    cy.visit('/');
    cy.processLogin(this.accessToken);
  });

  it('should display cash flows page', () => {
    cy.visit('/cash-flows');

    cy.get('[data-cy=cash-flows-header]');
  });

  it('should create cash flow', () => {
    cy.visit('/cash-flows');

    cy.get('[data-cy=cf-create-cash-flow-button]').click();

    cy.get('[data-cy=cfw-delete-cash-flow-item-button').should('be.disabled');

    cy.get('[data-cy=cfw-note]').type('Note');

    cy.get('[data-cy=cfw-contractor]').click();
    getSelectOption('[data-cy=cfw-contractor]', 1).click();

    cy.get('[data-cy=cfw-tags]').click();
    getSelectOption('[data-cy=cfw-tags]', 1).click();

    cy.get('[data-cy=cfw-save-button]').click().should('be.disabled');
    cy.get('[data-cy=cfw-save-button]').should('be.not.disabled');

    //
    cy.get('[data-cy=cfw-create-cash-flow-item-button').should('not.be.disabled').click();

    cy.get('[data-cy=cfiw-amount]').type('100');
    cy.get('[data-cy=cfiw-category]').click().type('Продукты');

    getSelectOption('[data-cy=cfiw-category]', 1).click();

    cy.get('[data-cy=cfiw-save-button]').click().should('be.disabled');

    cy.get('[data-cy=cfiw-form-header]').should('not.exist');

    //
    cy.get('[data-cy=cfw-create-cash-flow-item-button').should('not.be.disabled').click();
    cy.get('[data-cy=cfiw-amount]').type('200');

    cy.get('[data-cy=cfiw-category]').click().type('Продукты');
    getSelectOption('[data-cy=cfiw-category]', 2).click();

    cy.get('[data-cy=cfiw-quantity]').should('not.be.visible');
    cy.get('[data-cy=cfiw-show-additional-fields-button]').click();
    cy.get('[data-cy=cfiw-quantity]').should('be.visible');
    cy.get('[data-cy=cfiw-quantity]').type('1');
    cy.get('[data-cy=cfiw-is-not-confirmed]').click();
    cy.get('[data-cy=cfiw-note]').type('Note');
    cy.get('[data-cy=cfiw-save-and-create-more-button]').click().should('be.disabled');
    cy.get('[data-cy=cfiw-save-and-create-more-button]').should('be.not.disabled');

    cy.get('[data-cy=cfiw-amount]').should('be.empty');

    cy.get('[data-cy=cfiw-save-and-create-more-button]').click();

    cy.get('[data-cy=cfiw-amount]').should('have.attr', 'aria-invalid');

    cy.get('[data-cy=cfiw-cancel-button]').click();
    cy.get('[data-cy=cfiw-form-header]').should('not.exist');

    cy.get('tbody tr').eq(0).find('td').eq(5).should('contain', '-200');
    cy.get('tbody tr').eq(1).find('td').eq(5).should('contain', '-100');

    cy.get('[data-cy=cfw-close-button]').click();

    cy.get('tbody tr').eq(0).find('td').eq(2).should('contain', 'Продукты');
    cy.get('tbody tr').eq(0).find('td').eq(5).should('contain', '300');
    cy.get('tbody tr').eq(0).find('td').eq(7).should('contain', '-300');
  });
});
