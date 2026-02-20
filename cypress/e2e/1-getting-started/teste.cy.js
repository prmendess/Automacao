describe('Login GPREV Portal', () => {
  it('deve autenticar e exibir a tela inicial', () => {
    // Acessa a aplicação (redireciona para o login SSO/Keycloak)
    cy.visit('https://tst-adm-gprev.curitiba.pr.gov.br/inicio');

    // O login acontece em outro domínio (Keycloak), então usamos cy.origin
    cy.origin('https://dev-keycloak.ici.curitiba.org.br', () => {
      cy.get('#username').type('gestaoprev');
      cy.get('#password').type('!#g35t@0pr3v..', { log: false });
      cy.get('#kc-login').click();
    });

    // Valida a URL depois do login
    cy.url().should('include', '/inicio');

    // Valida textos característicos da tela logada
    cy.contains('GPREV Portal').should('be.visible');
    cy.contains('Bem-vindo!').should('be.visible');
    cy.contains('Você está autenticado com sucesso.').should('be.visible');
    cy.contains('Suas permissões:').should('be.visible');
    cy.contains('Nenhuma permissão atribuída').should('be.visible');
  });
});
