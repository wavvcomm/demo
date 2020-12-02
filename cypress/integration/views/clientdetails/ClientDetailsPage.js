const profilePicture = '.profilePicture';
const contactAddress = '.contactAddress';
class MessengerModal {
	getCurrentUrl() {
		return cy.url();
	}

	getClientPicture() {
		return cy.get(profilePicture);
	}

	getClientAddress() {
		return cy.get(contactAddress);
	}
}

export default MessengerModal;
