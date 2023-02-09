describe('user can enter about page with header about us', () => {
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

  