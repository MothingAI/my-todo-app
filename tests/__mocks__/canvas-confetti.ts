// Mock for canvas-confetti library
import { vi } from 'vitest'

const confetti = vi.fn(() => Promise.resolve())

// Add spy tracking
export const confettiSpy = confetti

export default confetti
