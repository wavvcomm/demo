/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';

describe('Home Page', () => {
	const home = new HomePage();
	it('should show homepage', () => {
		home.visit();
	});

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
		home.getTableHeaders().contains('Name');
		home.getTableHeaders().contains('Address');
		home.getTableHeaders().contains('City');
		home.getTableHeaders().contains('Numbers');
	});

	it('cannot start campaign until lead', () => {
		home.getStartCampaignButton().should('be.disabled');
	});
});
