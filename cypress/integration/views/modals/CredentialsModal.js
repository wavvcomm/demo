const credentialsModal = '.credentialsModal';
const userIdInput = `${credentialsModal} input[name="userId"]`;
const vendorIdInput = `${credentialsModal} input[name="vendorId"]`;
const apiKeyInput = `${credentialsModal} input[name="apiKey"]`;
const serverInput = `${credentialsModal} input[name="server"]`;
const saveButtonInput = '#form-button-save-credentials';
const connectButton = `${credentialsModal} .primary.button`;
const credentialCheckboxInput = `${credentialsModal} .radio.checkbox`;

class CredentialsModal {
	getCredentialsModal() {
		cy.get(credentialsModal);
	}

	setCredsIfVisible() {
		cy.get(credentialsModal).then(($modal) => {
			if ($modal.hasClass('visible')) {
				this.setUserId(Cypress.env('VENDOR_USER_ID'));
				this.setVendorId(Cypress.env('VENDOR_ID'));
				this.setApiKey(Cypress.env('API_KEY'));
				this.setServer(Cypress.env('SERVER'));
				this.clickSaveButton();
				this.selectFirstConnectionRadio();
				this.clickConnectButton();
			}
		});
	}

	selectFirstConnectionRadio() {
		cy.get(credentialCheckboxInput).click();
	}

	clickConnectButton() {
		cy.get(connectButton).click();
	}

	clickSaveButton() {
		cy.get(saveButtonInput).click();
	}

	setUserId(username) {
		cy.get(userIdInput).clear().type(username);
	}

	setVendorId(vendorId) {
		cy.get(vendorIdInput).clear().type(vendorId);
	}

	setApiKey(apiKey) {
		cy.get(apiKeyInput).clear().type(apiKey);
	}

	setServer(serverName) {
		cy.get(serverInput).clear().type(serverName);
	}
}
export default CredentialsModal;
