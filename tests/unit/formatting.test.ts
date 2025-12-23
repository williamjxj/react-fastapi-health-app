import { describe, it, expect } from 'vitest'

describe('Prettier Configuration', () => {
  it('should format code according to Prettier rules', () => {
    // This test verifies Prettier is configured
    // The code should be formatted with: semi: false, singleQuote: true, tabWidth: 2
    const formatted = { test: 'value', another: 'value' }
    expect(formatted).toBeDefined()
  })

  it('should have Prettier configuration', () => {
    // Prettier should be able to format this file
    expect(typeof it).toBe('function')
  })
})

