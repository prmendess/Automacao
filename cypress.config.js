const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Em CI: exclui specs que falham (GPREV inacessível fora da rede interna; exemplos com Cypress.env)
    excludeSpecPattern: process.env.CI
      ? [
          "**/teste.cy.js",
          "**/cypress_api.cy.js",
          "**/misc.cy.js",
        ]
      : [],
  },
});
