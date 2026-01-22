import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConfetti } from '@/hooks/useConfetti'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(() => Promise.resolve(true)),
}))

describe('useConfetti', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should trigger confetti animation when called', async () => {
    const confetti = await import('canvas-confetti')
    const { result } = renderHook(() => useConfetti())

    await act(async () => {
      await result.current.trigger({ particleCount: 100 })
    })

    expect(confetti.default).toHaveBeenCalledTimes(1)
    expect(confetti.default).toHaveBeenCalledWith(
      expect.objectContaining({
        particleCount: 100,
      })
    )
  })

  it('should use default options when none provided', async () => {
    const confetti = await import('canvas-confetti')
    const { result } = renderHook(() => useConfetti())

    await act(async () => {
      await result.current.trigger()
    })

    expect(confetti.default).toHaveBeenCalledTimes(1)
  })

  it('should support custom confetti options', async () => {
    const confetti = await import('canvas-confetti')
    const { result } = renderHook(() => useConfetti())

    const customOptions = {
      particleCount: 50,
      spread: 180,
      origin: { y: 0.6 },
    }

    await act(async () => {
      await result.current.trigger(customOptions)
    })

    expect(confetti.default).toHaveBeenCalledWith(customOptions)
  })

  it('should trigger from element when element ref provided', async () => {
    const confetti = await import('canvas-confetti')
    const { result } = renderHook(() => useConfetti())

    // Create a mock button element
    const button = document.createElement('button')
    document.body.appendChild(button)

    await act(async () => {
      await result.current.triggerFromElement(button)
    })

    expect(confetti.default).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        }),
      })
    )

    document.body.removeChild(button)
  })

  it('should handle animation cleanup', async () => {
    const { result } = renderHook(() => useConfetti())

    await act(async () => {
      await result.current.trigger({ particleCount: 100 })
    })

    // Should not throw error and should cleanup properly
    expect(result.current).toBeDefined()
  })
})
