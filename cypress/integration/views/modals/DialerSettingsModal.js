const settingsCog = '#settings-cog';
const dialerBarFrame = '#storm-frame-dialer-bar';
const stormFrameApp = '#storm-frame-app';
const dialWithPhoneInput = 'input[name="dial-with-phone"]';
const computerAudioInput = 'input[name="dial-with-webrtc"]';
const doneButton = '#web-rtc-prompt-dialog-right-button';
const closeSettingsButton = '#close-settings';
const phoneNumberInput = '#phone-number';
const dialingModeInput = '#dialing-mode';
const callerIDPhoneNumber = '#caller-id-phone-number';

class DialerSettingsModal {
	ifAudioTypeModalIsVisible(modeDialOrComputer = 'dial', remember = true) {
		cy.get(stormFrameApp).then(($modal) => {
			if ($modal.find(dialWithPhoneInput).length > 0) {
				this.setDefaultAudioMode(modeDialOrComputer, remember);
			}
		});
	}

	setDefaultAudioMode(modeDialOrComputer = 'dial', remember = true) {
		cy.get(stormFrameApp).iframe(() => {
			if (modeDialOrComputer === 'dial') {
				cy.get(dialWithPhoneInput).click();
			} else if (modeDialOrComputer === 'computer') {
				cy.get(computerAudioInput).click();
			}
			if (remember) {
				cy.get('label').contains('Remember this choice').click();
			}
			cy.get(doneButton).click();
		});
	}

	openSettingsModal() {
		cy.iframe(dialerBarFrame).find(settingsCog).click();
		this.ifAudioTypeModalIsVisible('dial', true);
	}

	closeSettingsModal() {
		cy.iframe(stormFrameApp).find(closeSettingsButton).click();
	}

	getPhoneNumber() {
		return cy.iframe(stormFrameApp).find(phoneNumberInput);
	}

	getCallerIDNumber() {
		return cy.iframe(stormFrameApp).find(callerIDPhoneNumber);
	}

	getDialingMode() {
		return cy.iframe(stormFrameApp).find(dialingModeInput);
	}

	getDialingModeOptions() {
		return cy
			.iframe(stormFrameApp)
			.find(dialingModeInput)
			.parent()
			.find('div[class*="OptionsContainer"] div[class*="-Option"]');
	}
}

export default DialerSettingsModal;
