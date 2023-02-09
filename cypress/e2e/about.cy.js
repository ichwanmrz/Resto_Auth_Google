describe('user can enter about page with header about us', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')

    cy.get('a[href*="about"]').click()

    cy.url().should('include', '/about')

    cy.get('h1').contains('ABOUT US')
  })

  it('passes', () => {
    cy.visit('http://localhost:3000/login')
  
      cy.get('#login').click()
  
      cy.url().should('include', '/login')
  
      cy.get('label').contains('Username')
      
    })
    it('webpage should be redirected to dashboard page after login', () => {

      cy.visit('http://localhost:3000/')
  
      cy.visit('http://localhost:3000/login')
  
      cy.get('#username').type('Admin')
  
      cy.get('#password').type('superadmin')
      
      cy.get('#login').click()
      
      cy.get('a[href*="dashboard"]').click()
  
      cy.get('h3').should('contain', "Welcome")
    })
})