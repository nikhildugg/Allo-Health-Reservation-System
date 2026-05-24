'use client'

import { useState, useEffect } from 'react'

export default function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setTimeLeft('EXPIRED')
        clearInterval(timer)
        return
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  if (!timeLeft) return <span>Loading...</span>

  return <span>{timeLeft}</span>
}
