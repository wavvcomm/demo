/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';
import ClientDetailsPage from '../../views/clientdetails/ClientDetailsPage';

describe('Home Page', () => {
	const home = new HomePage();
	const details = new ClientDetailsPage();
	it('shows the client details page for first', () => {
		home.visit();
		home.goToClientDetailsPage(0);
		details.getCurrentUrl().should('contain', '/detail/');
	});

	it('shows client details information', () => {
		home.visit();
		home.goToClientDetailsPage(0);
		details.getClientPicture().should('be.visible');
		details.getClientAddress().should('be.visible');
		details.getClientPicture().should('be.visible');
	});
});
