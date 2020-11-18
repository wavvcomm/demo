const dialerBarFrame = '#storm-frame-dialer-bar';
const startButton = '#start-button';
const dialButton = '#dial-button';

class DialerBar {
	getDialer() {
		return cy.get(dialerBarFrame);
	}

	clickStartButton() {
		cy.get(dialerBarFrame).iframe(() => {
			cy.get(startButton).click();
		});
	}

	clickDialButton() {
		cy.get(dialerBarFrame).iframe(() => {
			cy.get(dialButton, { timeout: 10 * 1000 }).click();
		});
	}
}
export default DialerBar;
