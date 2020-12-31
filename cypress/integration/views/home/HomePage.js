/// <reference types="cypress" />

const tableRows = 'table tbody tr';
const rowMessagingIcon = '.comment';
const messagingClientModal = '#storm-frame-app';
const tableHeader = 'table thead tr';
const tableHeaderCheckbox = 'table thead .checkbox';
const rowAddNumberIcon = '.plus';

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

	clickCallPhoneOnRow(rowNum, phoneRow = 0) {
		cy.get(tableRows).eq(rowNum).find('td').eq(5).find('.phone.icon').eq(phoneRow).click();
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

	clickSelectAllInput() {
		cy.get(tableHeaderCheckbox).click();
	}

	addNewNumberToTableRow(rowNum, phoneNumber) {
		cy.get(tableRows).eq(rowNum).find(rowAddNumberIcon).click();
		cy.get('.modals.active').contains('Add Number').should('be.visible');
		cy.get('.modals.active input').type(phoneNumber);
		cy.get('.positive.button').click();
	}

	getPhoneNumbersOnTableRow(rowNum) {
		return cy.get(tableRows).eq(rowNum).find('.leadPhoneNumber');
	}
}

export default HomePage;
