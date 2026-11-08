import React, { useEffect } from 'react'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
}

interface ToastProps {
  toast: ToastData | null
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'fas fa-heart-circle-check'
      case 'error':
        return 'fas fa-circle-exclamation'
      case 'info':
      default:
        return 'fas fa-sparkles'
    }
  }

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      <div className={`modern-toast toast-${toast.type}`}>
        <div className="toast-icon-wrap">
          <i className={getIcon()}></i>
        </div>

        <div className="toast-content">
          <div className="toast-title">{toast.title}</div>
          <div className="toast-message">{toast.message}</div>
        </div>

        <button
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="toast-progress">
          <div className="toast-progress-bar"></div>
        </div>
      </div>
    </div>
  )
}

