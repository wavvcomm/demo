/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';

describe('Home Page', () => {
	const home = new HomePage();
	beforeEach(() => {
		home.visit();
	});

	it('shows the leads table', () => {
		home.getTableRows().should('be.visible');
	});

	it('can open messaging window for a lead', () => {
		home.openMessagingOnTableRow(0, 0);
		home.getMessagingModal().should('be.visible');
	});

	it('displays name, address, city, and phone numbers', () => {
		home.getTableHeaders().contains('Name');
		home.getTableHeaders().contains('Address');
		home.getTableHeaders().contains('City');
		home.getTableHeaders().contains('Numbers');
	});

	it('cannot start campaign until lead', () => {
		home.getStartCampaignButton().should('be.disabled');
	});

	it('can start campaign after selecting all leads', () => {
		home.clickSelectAllInput();
		home.getStartCampaignButton().should('be.enabled');
	});

	it('can add new numbers to leads', () => {
		home.addNewNumberToTableRow(0, '8012438376');
		console.log(home.getPhoneNumbersOnTableRow(0));
		home.getPhoneNumbersOnTableRow(0).should('contain.text', '8012438376');
	});
});
