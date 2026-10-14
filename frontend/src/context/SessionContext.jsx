import { createContext, useContext, useMemo, useState } from 'react'
import { ROLE_META } from '../constants/roles'

const STORAGE_KEY = 'pp_preview_session'
const SessionContext = createContext(null)

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function SessionProvider({ children }) {
  const [session, setSessionState] = useState(readSession)

  const setSession = (next) => {
    setSessionState(next)
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else sessionStorage.removeItem(STORAGE_KEY)
  }

  const enterPreview = (role) => {
    const meta = ROLE_META[role]
    setSession({
      mode: 'interface_preview',
      role,
      displayName: meta.previewName,
      instituteName: meta.instituteName ?? null,
      assignedSubjects: meta.assignedSubjects ?? [],
    })
  }

  const leavePreview = () => setSession(null)

  const value = useMemo(
    () => ({ session, enterPreview, leavePreview, isPreview: Boolean(session) }),
    [session],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used within SessionProvider')
  return value
}
