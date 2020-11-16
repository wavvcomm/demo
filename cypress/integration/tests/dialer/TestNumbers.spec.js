/// <reference types="cypress" />
import HomePage from '../../views/home/HomePage';
import Numbers from '../../../fixtures/phone_numbers';
import DialerBar from '../../views/dialer/DialerBar';

describe('Test numbers', () => {
	const home = new HomePage();
	const dialer = new DialerBar();
	it('can call straight to voicemail number', () => {
		home.visit();
		home.addNewNumberToTableRow(0, Numbers.voicemail.number);
		home.getTableRow(0).contains(Numbers.voicemail.formated).parent().find('.phone.icon').click();
		dialer.clickStartButton();
	});
});
