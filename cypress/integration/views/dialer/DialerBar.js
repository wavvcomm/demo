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
		cy.get(dialerBarFrame).iframe(() => {
			cy.get(dialButton, { timeout: 10 * 1000 }).click();
		});
	}

	isPhoneRinging() {
		cy.iframe(dialerBarFrame)
			.find(lineOne)
			.should(
				'have.css',
				'background',
				'rgba(0, 0, 0, 0) url("https://stage1.stormapp.com/cbeb8285789ec9f27ec978e7e2d5c309/static/media/multiline_ringing.1da76ffb.gif") no-repeat scroll -2px 2px / 36px padding-box border-box'
			);
	}

	clickHangupButton() {
		cy.iframe(dialerBarFrame).find(hangupButton).click();
	}

	getHangUpButton() {
		return cy.iframe(dialerBarFrame).find(hangupButton);
	}

	clickDropVoicemail() {
		cy.iframe(dialerBarFrame)
			.find(vmDropButton, { timeout: 20 * 1000 })
			.click();
	}

	getCallDispositionModal() {
		return cy.get(callDispositionModal, { timeout: 400 * 1000 });
	}
}
export default DialerBar;
