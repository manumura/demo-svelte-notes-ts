import DeleteNoteModal from '../../src/components/DeleteNoteModal.svelte';
// import Counter from '../../src/lib/Counter.svelte';

// npx cypress open --component
describe('DeleteNoteModal', () => {
  const buttonDeleteSelector = '[id=btn-delete]';
  const buttonCancelSelector = '[id=btn-cancel]';
  const bodySelector = '[slot=body]';

  it('mounts with props', () => {
    cy.mount(DeleteNoteModal, { props: { isModalOpen: true, id: 1, title: 'Test DeleteNoteModal' } });
    cy.get(bodySelector).should('have.text', 'Are you sure you want to delete this note "Test DeleteNoteModal" ?');
  });

  it('should dispatch close event when clicking on cancel button', () => {
    // Arrange
    const onCloseSpy = cy.spy().as('onCloseSpy');
    cy.mount(DeleteNoteModal, { props: { isModalOpen: true, id: 1, title: 'Test DeleteNoteModal' } }).then(
      ({ component }) => {
        component.$on('close', onCloseSpy);
      },
    );
    // Act
    cy.get(buttonCancelSelector).click();
    // Assert
    cy.get('@onCloseSpy').should('have.been.calledWithMatch');
  });

  it('should dispatch delete event when clicking on delete button', () => {
    // Arrange
    const onDeleteSpy = cy.spy().as('onDeleteSpy');
    cy.mount(DeleteNoteModal, { props: { isModalOpen: true, id: 1, title: 'Test DeleteNoteModal' } }).then(
      ({ component }) => {
        component.$on('delete', onDeleteSpy);
      },
    );
    // Act
    cy.get(buttonDeleteSelector).click();
    // Assert
    cy.get('@onDeleteSpy').should('have.been.calledWithMatch', { detail: { id: 1 } });
  });
});
