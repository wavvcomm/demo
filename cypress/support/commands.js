// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('getIframeBody', (theIframe) => {
	// get the iframe > document > body
	// and retry until the body element is not empty
	return (
		cy
			.get(theIframe)

			// .should('not.be.empty')
			// wraps "body" DOM element to allow
			// chaining more Cypress commands, like ".find(...)"
			// https://on.cypress.io/wrap
			.then(cy.wrap)
	);
});

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
	// For more info on targeting inside iframes refer to this GitHub issue:
	// https://github.com/cypress-io/cypress/issues/136
	cy.log('Getting iframe body');

	return cy
		.wrap($iframe)
		.should((iframe) => expect(iframe.contents().find('body')).to.exist)
		.then((iframe) => cy.wrap(iframe.contents().find('body')))
		.within({}, callback);
});
