'use client'
 
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../toast'
import { useToast } from '../toast/use-toast'
import { css } from '@shadow-panda/styled-system/css'


export function Toaster() {
  const { toasts } = useToast()
 
  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast className={css({
            bg: "stone.800",
            color: "white",
        })} 
        key={id} 
        {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}