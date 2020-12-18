// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

before(() => {
	cy.clearLocalStorage();
});

beforeEach(() => {
	cy.getNewTestUser().then((response) => {
		cy.setLocalStorage('testUser', JSON.stringify(response));
		const credentials = [
			{
				active: true,
				apiKey: Cypress.env('API_KEY'),
				id: '2ab8fb42-88e0-4f44-b033-bb757cc09aac',
				server: Cypress.env('SERVER'),
				userId: response.data.id,
				vendorId: Cypress.env('VENDOR_ID'),
			},
		];
		cy.log('new user - ', response.data.id);
		cy.setLocalStorage('creds', JSON.stringify(credentials));
	});
});

after(() => {
	// cy.getLocalStorage('testUser').then((response) => {
	// 	cy.deleteTestUser(JSON.parse(response).data.id);
	// cy.stopAllCalls();
	// });
	cy.deleteAllTestUsers();
});
