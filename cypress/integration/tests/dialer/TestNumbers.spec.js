import HomePage from '../../views/home/HomePage';
import Numbers from '../../../fixtures/phone_numbers';
import DialerBar from '../../views/dialer/DialerBar';

describe('Campaign on test numbers', () => {
	const home = new HomePage();
	const dialer = new DialerBar();
	before(() => {
		home.visit();
		home.clickSelectAllInput();
		home.getStartCampaignButton().click();
		dialer.clickStartButton();
	});

	it('can call straight to voicemail number', () => {
		home.getTableRow(0).contains(Numbers.voicemail.formated).parent().find('.phone.icon').click();
		dialer.clickDialButton();
		dialer.clickDropVoicemail();
	});

	it('can see phone is ringing', () => {
		// home.getTableRow(1).contains(Numbers.onlyring.formated).parent().find('.phone.icon').click();
		dialer.isPhoneRinging();
		dialer.clickHangupButton();
	});

	it('can see call was answered', () => {
		// home.getTableRow(1).contains(Numbers.onlyring.formated).parent().find('.phone.icon').click();
		// dialer.clickHangupButton();
		dialer.isPhoneRinging();
		dialer.isPhoneAnswered();
	});

	it('can see hangup after long time on call', () => {
		// home.getTableRow(4).contains(Numbers.hangup.formated).parent().find('.phone.icon').click();
		dialer.getHangUpButton().should('be.visible');
		dialer.getCallDispositionModal().should('be.visible');
	});
});
