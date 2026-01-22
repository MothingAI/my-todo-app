import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Mock canvas-confetti to avoid canvas API issues in jsdom
vi.mock('canvas-confetti', () => ({
  default: vi.fn(() => Promise.resolve()),
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
})
