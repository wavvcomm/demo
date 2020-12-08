/// <reference types="cypress" />
/// <reference types = "Cypress-iframe"/>
import 'cypress-iframe';

const dialerBarFrame = '#storm-frame-dialer-bar';
const startButton = '#start-button';
const dialButton = '#dial-button';
const vmDropButton = '#vm-drop';
const lineOne = '#line-1';
const hangupButton = '#hangup-button';
const callDispositionModal = '.callDispositionModal';
const dialerPhoneNumber = '#line-1 > div:nth-child(1) > div';

class DialerBar {
	dialerBarIsLoaded() {
		cy.frameLoaded(dialerBarFrame);
	}

	getDialer() {
		return cy.get(dialerBarFrame);
	}

	clickStartButton() {
		cy.iframe(dialerBarFrame)
			.find(startButton, { timeout: 10 * 1000 })
			.click();
	}

	clickDialButton() {
		cy.iframe(dialerBarFrame)
			.find(dialButton, { timeout: 10 * 1000 })
			.click();
	}

	isPhoneRinging() {
		cy.iframe(dialerBarFrame)
			.find(lineOne, { timeout: 10 * 1000 })
			.should(
				'have.css',
				'background',
				'rgba(0, 0, 0, 0) url("https://stage1.stormapp.com/0647ff2206aacb28933b0cf1722dc04d/static/media/multiline_ringing.1da76ffb.gif") no-repeat scroll -2px 2px / 36px padding-box border-box'
			);
	}

	clickHangupButton() {
		cy.iframe(dialerBarFrame)
			.find(hangupButton, { timeout: 10 * 1000 })
			.click();
	}

	getHangUpButton() {
		return cy.iframe(dialerBarFrame).find(hangupButton, { timeout: 10 * 1000 });
	}

	clickDropVoicemail() {
		cy.iframe(dialerBarFrame)
			.find(vmDropButton, { timeout: 20 * 1000 })
			.click();
	}

	getCallDispositionModal() {
		return cy.get(callDispositionModal, { timeout: 400 * 1000 });
	}

	getDialerPhoneNumber() {
		return cy.iframe(dialerBarFrame).find(dialerPhoneNumber);
	}

	isPhoneAnswered() {
		cy.iframe(dialerBarFrame)
			.find(lineOne, { timeout: 15 * 1000 })
			.should(
				'have.css',
				'background',
				'rgba(0, 0, 0, 0) url("https://stage1.stormapp.com/0647ff2206aacb28933b0cf1722dc04d/static/media/multiline_ringing.1da76ffb.gif") no-repeat scroll -2px 2px / 36px padding-box border-box'
			);
	}
}
export default DialerBar;
