'use client'
import { useCountUp } from '@/hooks/useCountUp'

export default function AnimatedNumber({ value }: { value: number }) {
  const { count, elementRef } = useCountUp(value)
  return <span ref={elementRef as any}>{count.toLocaleString()}</span>
}
