const dialerBarFrame = '#storm-frame-dialer-bar';
const startButton = '#start-button';

class DialerBar {
	getDialer() {
		return cy.get(dialerBarFrame);
	}

	clickStartButton() {
		cy.get(dialerBarFrame).iframe(() => {
			cy.get(startButton, { timeout: 10 * 1000 }).click();
		});
	}
}
export default DialerBar;
