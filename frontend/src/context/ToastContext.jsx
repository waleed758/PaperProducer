import { createContext, useCallback, useContext, useState } from 'react'
import { useLanguage } from './LanguageContext'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const { t } = useLanguage()
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((message) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4200)
  }, [])

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            {t(toast.message)}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used within ToastProvider')
  return value
}
