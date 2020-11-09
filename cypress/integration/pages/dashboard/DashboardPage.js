/// <reference types="cypress" />

const tableRows = 'table tr';

class DashboardPage {
	visit() {
		cy.visit('/');
	}

	getTableRows() {
		return cy.get(tableRows);
	}

	clickMessagingIcon(row) {
		cy.get(row).find('.comment').click();
	}
}

export default DashboardPage;
