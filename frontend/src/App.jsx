import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import { ToastProvider } from './context/ToastContext'
import { LanguageProvider } from './context/LanguageContext'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ToastProvider>
          <SessionProvider>
            <AppRoutes />
          </SessionProvider>
        </ToastProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}
