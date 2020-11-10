/// <reference types="cypress" />

import DashboardPage from '../../pages/dashboard/DashboardPage';

describe('Dashboard Page', () => {
	const dashboard = new DashboardPage();
	it('should show dashboard', () => {
		dashboard.visit();
	});

	it('shows the leads table', () => {
		dashboard.visit();
		dashboard.getTableRows().should('be.visible');
	});

	it('can open messaging window for a lead', () => {
		dashboard.visit();
		dashboard.clickMessagingOnTableRow(0);
		dashboard.getMessagingModal().should('be.visible');
	});
});
