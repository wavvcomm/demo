/// <reference types="cypress" />

const tableRows = 'table tbody tr';
const rowMessagingIcon = '.comment';
const messagingClientModal = '#storm-frame-app';

class DashboardPage {
	visit() {
		cy.visit('/');
	}

	getTableRows() {
		return cy.get(tableRows);
	}

	clickMessagingIcon(row) {
		cy.get(row).find(rowMessagingIcon).click();
	}

	getTableRow(rowNum) {
		return cy.get(tableRows).eq(rowNum);
	}

	clickMessagingOnTableRow(rowNum) {
		cy.get(tableRows).eq(rowNum).find(rowMessagingIcon).click();
	}

	getMessagingModal() {
		return cy.get(messagingClientModal);
	}
}

export default DashboardPage;
