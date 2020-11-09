/// <reference types="cypress" />

import DashboardPage from '../../pages/dashboard/DashboardPage';

describe('Dashboard Page', () => {
	const dashboard = new DashboardPage();
	it('should show dashboard', () => {
		dashboard.visit();
	});
});
