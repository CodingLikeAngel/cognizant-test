describe('Candidates Page', () => {

  beforeEach(() => {
    cy.visit('/candidates');
  });

  it('should display the correct page title', () => {
    cy.contains('h1.header-title', 'Gestión')
      .should('be.visible');

    cy.contains('.t3', 'Candidatos')
      .should('be.visible');
  });

  it('should render the left panel with the form', () => {
    cy.get('section.card-left')
      .should('exist')
      .within(() => {
        cy.contains('h2.panel-title', '¡Nuevo Perfil!').should('be.visible');
        cy.get('lib-candidates-form').should('exist');
      });
  });

  it('should render the right panel with the candidates table', () => {
    cy.get('section.card-right')
      .should('exist')
      .within(() => {
        cy.contains('h2.panel-title', 'Listado de Candidatos').should('be.visible');
        cy.get('lib-candidates-table').should('exist');
      });
  });

  it('should have animated orbs and particles visible', () => {
    cy.get('.orb-sun').should('exist');
    cy.get('.orb-dream').should('exist');
    cy.get('.orb-bubble').should('exist');

    cy.get('.particle.p1').should('exist');
    cy.get('.particle.p2').should('exist');
    cy.get('.particle.p3').should('exist');
    cy.get('.particle.p4').should('exist');
  });

});
