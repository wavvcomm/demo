import HomePage from '../../views/home/HomePage';
import Numbers from '../../../fixtures/phone_numbers';
import DialerBar from '../../views/dialer/DialerBar';

describe('Campaign on test numbers', () => {
	const home = new HomePage();
	const dialer = new DialerBar();
	beforeEach(() => {
		home.visit();
	});

	it('can call straight to voicemail number', () => {
		home.getTableRow(0).contains(Numbers.voicemail.formated).parent().find('.phone.icon').click();
		// dialer.clickStartButton();
		dialer.clickDropVoicemail();
	});

	it('can see phone is ringing', () => {
		home.getTableRow(1).contains(Numbers.onlyring.formated).parent().find('.phone.icon').click();
		dialer.isPhoneRinging();
		dialer.clickHangupButton();
	});

	it('can see hangup after long time on call', () => {
		home.getTableRow(4).contains(Numbers.hangup.formated).parent().find('.phone.icon').click();
		dialer.getHangUpButton().should('be.visible');
		dialer.getCallDispositionModal().should('be.visible');
	});
});
