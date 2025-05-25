import { ButtonHTMLAttributes } from 'react'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { locked: boolean }
export default function LockToggle({ locked, className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`btn lock-toggle ${className ?? ''}`}
      role="button"
      aria-pressed={locked}
    >
      {locked ? '🔒' : '🔓'}
    </button>
  )
}