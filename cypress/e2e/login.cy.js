describe('user can enter about page with header about us', () => {

it('passes', () => {
    cy.visit('http://localhost:3000/login')
  
      cy.get('#login').click()
  
      cy.url().should('include', '/login')
  
      cy.get('label').contains('Username')
      
    })
})