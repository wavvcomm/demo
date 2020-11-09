/// <reference types="cypress" />

class DashboardPage {
    visit() {
        cy.visit("/");
    }
};

export default DashboardPage;