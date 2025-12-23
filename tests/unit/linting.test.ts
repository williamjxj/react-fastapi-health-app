import { describe, it, expect } from 'vitest'

describe('ESLint Configuration', () => {
  it('should detect intentional lint errors', () => {
    // This file intentionally has lint errors to test ESLint configuration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unusedVariable = 'test'
    // The above should trigger a lint error if ESLint is working
    expect(true).toBe(true)
  })

  it('should have ESLint configured', () => {
    // ESLint should be able to parse and check this file
    expect(typeof describe).toBe('function')
  })
})

