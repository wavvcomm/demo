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
			.find(lineOne)
			.should(
				'have.css',
				'background',
				'rgba(0, 0, 0, 0) url("https://stage1.stormapp.com/cbeb8285789ec9f27ec978e7e2d5c309/static/media/multiline_icons.8d88a795.svg") no-repeat scroll 0px -270px / auto padding-box border-box'
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

	getDialerPhoneNumber() {
		return cy.iframe(dialerBarFrame).find(dialerPhoneNumber);
	}
}
export default DialerBar;
