import { useEffect } from 'react'
import { useConfetti } from '../hooks/useConfetti'

interface ConfettiAnimationProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiAnimation({ trigger, onComplete }: ConfettiAnimationProps) {
  const { trigger: triggerConfetti } = useConfetti()

  useEffect(() => {
    if (trigger) {
      triggerConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Auto-dismiss after 2 seconds
      const timer = setTimeout(() => {
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [trigger, triggerConfetti, onComplete])

  return null
}
