import type { CSSProperties } from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string
  height?: string
  radius?: string
  className?: string
}

/** Bloco de carregamento com shimmer, reutilizável em qualquer layout. */
export function Skeleton({ width = '100%', height = '1rem', radius, className }: SkeletonProps) {
  const style: CSSProperties = { width, height }
  if (radius) style.borderRadius = radius

  return (
    <span
      className={`${styles.skeleton} ${className ?? ''}`}
      style={style}
      aria-hidden="true"
    />
  )
}
