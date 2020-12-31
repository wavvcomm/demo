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

import 'cypress-iframe';
import 'cypress-localstorage-commands';
import axios from 'axios';

// Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
// 	// For more info on targeting inside iframes refer to this GitHub issue:
// 	// https://github.com/cypress-io/cypress/issues/136
// 	cy.log('Getting iframe body');

// 	return cy
// 		.wrap($iframe)
// 		.should((iframe) => expect(iframe.contents().find('body')).to.exist)
// 		.then((iframe) => cy.wrap(iframe.contents().find('body')))
// 		.within({}, callback);
// });

Cypress.Commands.add('getNewTestUser', () => {
	const apiUrl = `${Cypress.env('SERVER_URL')}/api/testing`;
	cy.log('getting new test user');

	cy.wrap(
		axios.post(
			apiUrl,

			{
				email: 'testing@wavv.com',
				firstName: 'tester',
				lastName: 'lastName',
				address1: '1411 W 1250 S',
				address2: 'Suite 300',
				city: 'Orem',
				state: 'UT',
				zip: '84058',
				subscriptions: {
					multi: true,
					sms: true,
				},
				free: false,
				showTos: false,
			},
			{
				auth: {
					username: Cypress.env('VENDOR_ID'),
					password: Cypress.env('API_KEY'),
				},
			}
		)
	);
});

Cypress.Commands.add('stopAllCalls', (user) => {
	const deleteUrl = `${Cypress.env('SERVER_URL')}/api/testing/${user}/calls`;
	cy.log('sending stop all calls endpoint');
	axios.delete(deleteUrl, {
		auth: {
			username: Cypress.env('VENDOR_ID'),
			password: Cypress.env('API_KEY'),
		},
	});
});

Cypress.Commands.add('deleteTestUser', (user) => {
	const deleteUrl = `${Cypress.env('SERVER_URL')}/api/testing/${user}`;
	cy.log('deleting test user');
	axios.delete(deleteUrl, {
		auth: {
			username: Cypress.env('VENDOR_ID'),
			password: Cypress.env('API_KEY'),
		},
	});
});

Cypress.Commands.add('deleteAllTestUsers', () => {
	const deleteUrl = `${Cypress.env('SERVER_URL')}/api/testing/${Cypress.env('VENDOR_USER_ID')}`;
	cy.log('deleting all test users');
	axios.delete(deleteUrl, {
		auth: {
			username: Cypress.env('VENDOR_ID'),
			password: Cypress.env('API_KEY'),
		},
	});
});
