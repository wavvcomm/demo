const messagingClientModal = '#storm-frame-app';
class MessengerModal {
	getModal() {
		return cy.get(messagingClientModal);
	}
}

export default MessengerModal;
