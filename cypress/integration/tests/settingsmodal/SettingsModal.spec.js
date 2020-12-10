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

	it('should have test phone number', () => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
		settings.openSettingsModal();
		settings.getPhoneNumber().should('contain.text', '000-0000');
	});

	it('should have test caller id number', () => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
		settings.openSettingsModal();
		settings.getCallerIDNumber().should('contain.text', '000-0000');
	});

	it('can change dialing mode', () => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
		settings.openSettingsModal();
		settings.getDialingMode().click();
		settings.getDialingModeOptions().eq(0).should('contain.text', 'Standard');
		settings.getDialingModeOptions().eq(1).should('contain.text', 'Advanced');
	});
});
