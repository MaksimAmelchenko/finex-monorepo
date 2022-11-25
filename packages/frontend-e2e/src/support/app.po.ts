export const getSelectOption = (selectSelector: string, index: number) =>
  cy.get(selectSelector).find(`div > :nth-child(4) > div > :nth-child(${index})`);
