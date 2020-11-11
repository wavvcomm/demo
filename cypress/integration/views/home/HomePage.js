/// <reference types="cypress" />

const tableRows = 'table tbody tr';
const rowMessagingIcon = '.comment';
const messagingClientModal = '#storm-frame-app';
const tableHeader = 'table thead tr';

class HomePage {
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

	openMessagingOnTableRow(rowNum = 0, phoneNum = 0, modalOrDock = 'Modal') {
		cy.get(tableRows).eq(rowNum).find(rowMessagingIcon).eq(phoneNum).click();
		cy.get(tableRows).eq(rowNum).contains(modalOrDock).click();
	}

	getMessagingModal() {
		return cy.get(messagingClientModal);
	}

	getTableHeaders() {
		return cy.get(tableHeader);
	}

	goToClientDetailsPage(rowNum) {
		cy.get(tableRows).eq(rowNum).find('.detailsLink').click();
	}

	getStartCampaignButton() {
		return cy.get('button').contains('Start Campaign');
	}
}

export default HomePage;
