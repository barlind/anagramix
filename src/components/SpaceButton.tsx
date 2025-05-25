import { ButtonHTMLAttributes } from 'react'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}
export default function SpaceButton({ className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`btn space-button ${className ?? ''}`}
      role="button"
    >
      {children}
    </button>
  )
}