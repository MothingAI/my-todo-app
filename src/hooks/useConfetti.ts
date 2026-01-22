import { useCallback } from 'react'
import confetti from 'canvas-confetti'
import type { Options } from 'canvas-confetti'

export function useConfetti() {
  const trigger = useCallback(async (options?: Options) => {
    const defaultOptions: Options = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      ...options,
    }

    await confetti(defaultOptions)
  }, [])

  const triggerFromElement = useCallback(async (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const centerX = (rect.left + rect.right) / 2 / window.innerWidth
    const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight

    await confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: centerX, y: centerY },
    })
  }, [])

  return {
    trigger,
    triggerFromElement,
  }
}
