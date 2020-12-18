import HomePage from '../../views/home/HomePage';
import DialerBar from '../../views/dialer/DialerBar';

describe('Campaign on test numbers', () => {
	const home = new HomePage();
	const dialer = new DialerBar();
	beforeEach(() => {
		home.visit();
	});

	it('can call straight to voicemail number', () => {
		home.clickCallPhoneOnRow(0, 0);
		dialer.clickStartButton();
		dialer.clickDropVoicemail();
	});

	it('can see phone is ringing', () => {
		home.clickCallPhoneOnRow(1, 0);
		dialer.clickStartButton();
		dialer.isPhoneRinging();
		dialer.clickHangupButton();
	});

	it('can see call was answered', () => {
		home.clickCallPhoneOnRow(1, 0);
		dialer.clickStartButton();
		dialer.isPhoneRinging();
		dialer.isPhoneAnswered();
	});

	it('can see hangup after long time on call', () => {
		home.clickCallPhoneOnRow(4, 0);
		dialer.clickStartButton();
		dialer.getHangUpButton().should('be.visible');
		dialer.getCallDispositionModal().should('be.visible');
	});
});
