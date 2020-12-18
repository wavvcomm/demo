/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';

describe('Home Page', () => {
	const home = new HomePage();

	it('shows the leads table', () => {
		home.visit();
		home.getTableRows().should('be.visible');
	});

	it('can open messaging window for a lead', () => {
		home.visit();
		home.openMessagingOnTableRow(0, 0);
		home.getMessagingModal().should('be.visible');
	});

	it('displays name, address, city, and phone numbers', () => {
		home.visit();
		home.getTableHeaders().contains('Name');
		home.getTableHeaders().contains('Address');
		home.getTableHeaders().contains('City');
		home.getTableHeaders().contains('Numbers');
	});

	it('cannot start campaign until lead', () => {
		home.visit();
		home.getStartCampaignButton().should('be.disabled');
	});

	it('can start campaign after selecting all leads', () => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().should('be.enabled');
	});

	it('can add new numbers to leads', () => {
		home.visit();
		home.addNewNumberToTableRow(0, '8018018018');
		home.getPhoneNumbersOnTableRow(0).should('contain.text', '(801) 801-8018');
	});
});
