import EditNote from '../../src/pages/EditNote.svelte';
import { mount } from 'cypress-svelte-unit-test';

describe('EditNote', function () {
  it('renders EditNote with correct heading', () => {
    mount(EditNote);
    cy.get('heading').should('exist').should('be.visible');
  });
});
