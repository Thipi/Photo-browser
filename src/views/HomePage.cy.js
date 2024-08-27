/* eslint-disable no-undef */
import HomePage from './HomePage.vue'
import { mount } from 'cypress/vue'


describe('HomePage Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/photos**', { fixture: 'photos.json' }).as('getPhotos');
    mount(HomePage);
    cy.wait('@getPhotos');
  });

  // Test for correct loading of photos
  it('should load the initial set of photos correctly', () => {
    cy.get('.photo-thumbnail').should('have.length', 3);
  });

  // Test for correct handling of visible photos
  it('should only store visible photos in the DOM', () => {
    cy.get('.photo-thumbnail').should('have.length', 3);
  });

  // Test for modal display functionality
  it('should display the modal when a photo is clicked', () => {
    cy.get('.photo-thumbnail').first().click();
    cy.get('.photo-modal').should('be.visible');
  });
});