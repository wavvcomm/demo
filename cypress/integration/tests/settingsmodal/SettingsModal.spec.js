/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';
import MessengerModal from '../../views/modals/DialerSettingsModal';

describe('Settings Modal', () => {
	const home = new HomePage();
	const settings = new MessengerModal();

	it('can be opened C1', () => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
		settings.openSettingsModal();
	});

	it('can be closed C2', () => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
		settings.openSettingsModal();
		settings.closeSettingsModal();
	});
});
