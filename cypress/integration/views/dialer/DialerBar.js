const dialerBarFrame = '#storm-frame-dialer-bar';
const startButton = '#start-button';

class DialerBar {
	getDialer() {
		return cy.get(dialerBarFrame);
	}

	clickStartButton() {
		cy.get(dialerBarFrame).iframe(() => {
			cy.get(startButton).click();
		});
	}
}
export default DialerBar;
