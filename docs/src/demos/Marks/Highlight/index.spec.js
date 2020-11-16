context('/api/marks/highlight', () => {
  before(() => {
    cy.visit('/api/marks/highlight')
  })

  beforeEach(() => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor
        .chain()
        .setContent('<p>Example Text</p>')
        .selectAll()
        .run()
    })
  })

  it('the button should highlight the selected text', () => {
    cy.get('.demo__preview button:first')
      .click()

    cy.get('.ProseMirror')
      .find('mark')
      .should('contain', 'Example Text')
  })

  it('should highlight the text in a specific color', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.commands.highlight({ color: 'red' })

      cy.get('.ProseMirror')
        .find('mark')
        .should('contain', 'Example Text')
        .should('have.attr', 'data-color', 'red')
    })
  })

  it('should update the attributes of existing marks', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor
        .chain()
        .setContent('<p><mark style="background-color: blue;">Example Text</mark></p>')
        .selectAll()
        .highlight({ color: 'rgb(255, 0, 0)' })
        .run()

      cy.get('.ProseMirror')
        .find('mark')
        .should('have.css', 'background-color', 'rgb(255, 0, 0)')
    })
  })

  it('should remove existing marks with the same attributes', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor
        .chain()
        .setContent('<p><mark style="background-color: rgb(255, 0, 0);">Example Text</mark></p>')
        .selectAll()
        .highlight({ color: 'rgb(255, 0, 0)' })
        .run()

      cy.get('.ProseMirror')
        .find('mark')
        .should('not.exist')
    })
  })

  it('is active for mark with any attributes', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor
        .chain()
        .setContent('<p><mark data-color="red">Example Text</mark></p>')
        .selectAll()
        .run()

      expect(editor.isActive('highlight')).to.eq(true)
    })
  })

  it('is active for mark with same attributes', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor
        .chain()
        .setContent('<p><mark style="background-color: rgb(255, 0, 0);">Example Text</mark></p>')
        .selectAll()
        .run()

      const isActive = editor.isActive('highlight', {
        color: 'rgb(255, 0, 0)',
      })

      expect(isActive).to.eq(true)
    })
  })

  it('isn’t active for mark with other attributes', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor
        .chain()
        .setContent('<p><mark style="background-color: rgb(255, 0, 0);">Example Text</mark></p>')
        .selectAll()
        .run()

      const isActive = editor.isActive('highlight', {
        color: 'rgb(0, 0, 0)',
      })

      expect(isActive).to.eq(false)
    })
  })

  it('the button should toggle the selected text highlighted', () => {
    cy.get('.demo__preview button:first')
      .click()

    cy.get('.ProseMirror')
      .type('{selectall}')

    cy.get('.demo__preview button:first')
      .click()

    cy.get('.ProseMirror')
      .find('mark')
      .should('not.exist')
  })

  it('the keyboard shortcut should highlight the selected text', () => {
    cy.get('.ProseMirror')
      .trigger('keydown', { modKey: true, key: 'e' })
      .find('mark')
      .should('contain', 'Example Text')
  })

  it('the keyboard shortcut should toggle the selected text highlighted', () => {
    cy.get('.ProseMirror')
      .trigger('keydown', { modKey: true, key: 'e' })
      .trigger('keydown', { modKey: true, key: 'e' })
      .find('mark')
      .should('not.exist')
  })
})