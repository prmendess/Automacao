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

describe('Tela de Detalhes - Informações Obrigatórias', () => {
  beforeEach(() => {
    // Pré-condição: Autenticação e navegação para tela de detalhes
    cy.visit('https://tst-adm-gprev.curitiba.pr.gov.br/inicio');

    cy.origin('https://dev-keycloak.ici.curitiba.org.br', () => {
      cy.get('#username').type('gestaoprev');
      cy.get('#password').type('!#g35t@0pr3v..', { log: false });
      cy.get('#kc-login').click();
    });

    // Aguarda login completo
    cy.url().should('include', '/inicio');
    cy.contains('GPREV Portal').should('be.visible');

    // Navega para a tela de detalhes (ajustar URL conforme necessário)
    // Exemplo: cy.visit('https://tst-adm-gprev.curitiba.pr.gov.br/protocolo/123/detalhes');
    // ou clicar em um link/botão que leva aos detalhes
  });

  it('deve exibir todas as informações obrigatórias', () => {
    // Passo 1: Visualizar campos exibidos - todos os campos obrigatórios devem estar visíveis
    cy.contains(/descrição/i).should('be.visible');
    cy.contains(/assunto.*protocolo|protocolo.*sup|sup/i).should('be.visible');
    cy.contains(/situação/i).should('be.visible');
    cy.contains(/data.*criação|criação/i).should('be.visible');
    cy.contains(/data.*alteração|alteração/i).should('be.visible');
    cy.contains(/usuário.*responsável|responsável/i).should('be.visible');

    // Passo 2: Conferir Descrição - valor exibido corretamente
    cy.contains(/descrição/i).should('be.visible').then(($label) => {
      cy.wrap($label).parent().within(() => {
        cy.get('input, textarea').then(($inputs) => {
          if ($inputs.length > 0) {
            cy.wrap($inputs.first()).should('be.visible').invoke('val').should('not.be.empty');
          } else {
            cy.get('p, span, div').not($label).first().should('be.visible').invoke('text').should('not.be.empty');
          }
        });
      });
    });

    // Passo 3: Conferir Assunto Protocolo (SUP) - valor exibido corretamente
    cy.contains(/assunto.*protocolo|protocolo.*sup|sup/i).should('be.visible').then(($label) => {
      cy.wrap($label).parent().within(() => {
        cy.get('input, textarea').then(($inputs) => {
          if ($inputs.length > 0) {
            cy.wrap($inputs.first()).should('be.visible').invoke('val').should('not.be.empty');
          } else {
            cy.get('p, span, div').not($label).first().should('be.visible').invoke('text').should('not.be.empty');
          }
        });
      });
    });

    // Passo 4: Conferir Situação - Ativo/Inativo exibido corretamente
    cy.contains(/situação/i).should('be.visible').then(($label) => {
      cy.wrap($label).parent().within(() => {
        cy.get('input, select, badge, span, p, div').not($label).first()
          .should('be.visible')
          .invoke('text')
          .then((texto) => {
            const situacao = texto.trim().toLowerCase();
            expect(['ativo', 'inativo']).to.include(situacao);
          });
      });
    });

    // Passo 5: Conferir Data Criação/Alteração - datas exibidas corretamente
    // Regex para formato DD/MM/AAAA ou DD/MM/AAAA HH:MM ou DD/MM/AAAA HH:MM:SS
    const regexData = /^\d{2}\/\d{2}\/\d{4}(\s+\d{2}:\d{2}(:\d{2})?)?$/;

    // Data Criação
    cy.contains(/data.*criação|criação/i).should('be.visible').then(($label) => {
      cy.wrap($label).parent().within(() => {
        cy.get('input').then(($inputs) => {
          if ($inputs.length > 0) {
            cy.wrap($inputs.first()).should('be.visible').invoke('val').then((valor) => {
              expect(valor.toString().trim()).to.match(regexData);
            });
          } else {
            cy.get('p, span, div').not($label).first().should('be.visible').invoke('text').then((texto) => {
              expect(texto.trim()).to.match(regexData);
            });
          }
        });
      });
    });

    // Data Alteração
    cy.contains(/data.*alteração|alteração/i).should('be.visible').then(($label) => {
      cy.wrap($label).parent().within(() => {
        cy.get('input').then(($inputs) => {
          if ($inputs.length > 0) {
            cy.wrap($inputs.first()).should('be.visible').invoke('val').then((valor) => {
              expect(valor.toString().trim()).to.match(regexData);
            });
          } else {
            cy.get('p, span, div').not($label).first().should('be.visible').invoke('text').then((texto) => {
              expect(texto.trim()).to.match(regexData);
            });
          }
        });
      });
    });

    // Passo 6: Conferir Usuário responsável - nome do usuário exibido
    cy.contains(/usuário.*responsável|responsável/i).should('be.visible').then(($label) => {
      cy.wrap($label).parent().within(() => {
        cy.get('input, textarea').then(($inputs) => {
          if ($inputs.length > 0) {
            cy.wrap($inputs.first()).should('be.visible').invoke('val').should('not.be.empty');
          } else {
            cy.get('p, span, div').not($label).first().should('be.visible').invoke('text').should('not.be.empty');
          }
        });
      });
    });
  });
});
