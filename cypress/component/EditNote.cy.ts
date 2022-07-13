import EditNotePage from '../../src/pages/EditNotePage.svelte';
import { mount } from 'cypress-svelte-unit-test';

describe('EditNotePage', function () {
  it('renders EditNotePage with correct heading', () => {
    mount(EditNotePage);
    cy.get('heading').should('exist').should('be.visible');
  });
});
