const messagingClientModal = '#storm-frame-app';
class MessengerModal {
	getModal() {
		return cy.get(messagingClientModal);
	}

	minimizeModal() {
		cy.get("use[href='#minimize']").click();
	}

	closeModal() {
		cy.get("use[href='#close']").click();
	}
}

export default MessengerModal;
