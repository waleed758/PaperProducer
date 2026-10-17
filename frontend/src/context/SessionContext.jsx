import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest, authPost } from '../services/api'

const SessionContext = createContext(null)

function normalizeUser(user) {
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email
  return {
    ...user,
    displayName,
    instituteName: user.institute?.name ?? null,
    assignedSubjects: [],
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(false)

  const refreshSession = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiRequest('/auth/me/')
      setSession(normalizeUser(response.user))
      setConnectionError(false)
    } catch (error) {
      setSession(null)
      setConnectionError(error.status !== 401)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const signIn = async (credentials) => {
    const response = await authPost('/auth/login/', credentials)
    setSession(normalizeUser(response.user))
    setConnectionError(false)
  }

  const signUp = async (details) => {
    const response = await authPost('/auth/signup/', details)
    setSession(normalizeUser(response.user))
    setConnectionError(false)
  }

  const signOut = async () => {
    await authPost('/auth/logout/', {})
    setSession(null)
  }

  const value = useMemo(
    () => ({ session, loading, connectionError, signIn, signUp, signOut, refreshSession }),
    [session, loading, connectionError, refreshSession],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used within SessionProvider')
  return value
}
