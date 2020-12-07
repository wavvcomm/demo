/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';
import MessengerModal from '../../views/modals/DialerSettingsModal';

describe('Settings Modal', () => {
	const home = new HomePage();
	const settings = new MessengerModal();

	beforeEach(() => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
	});

	it('can be opened C1', () => {
		settings.openSettingsModal();
	});

	it('can be closed C2', () => {
		settings.openSettingsModal();
		settings.closeSettingsModal();
	});

	it('should have test phone number', () => {
		settings.openSettingsModal();
		settings.getPhoneNumber().should('contain.text', '000-0000');
	});

	it('should have test caller id number', () => {
		settings.openSettingsModal();
		settings.getCallerIDNumber().should('contain.text', '000-0000');
	});

	it('can change dialing mode', () => {
		settings.openSettingsModal();
		settings.getDialingMode().click();
		settings.getDialingModeOptions().eq(0).should('contain.text', 'Standard');
		settings.getDialingModeOptions().eq(1).should('contain.text', 'Advanced');
	});
});
