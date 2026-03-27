import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

function getAuthenticatedRedirectPath(user) {
  if (user?.role === 'startup' && !user?.startup_profile && !user?.startupProfile) {
    return '/onboarding/startup'
  }

  if (user?.role === 'talent' && !user?.talent_profile && !user?.talentProfile) {
    return '/onboarding/talent'
  }

  return '/dashboard'
}

export default function GuestRoute() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [loading, setLoading] = useState(Boolean(token) && !user)

  useEffect(() => {
    const hydrateUser = async () => {
      if (!token || user) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const { data } = await api.get('/me')
        setUser(data)
      } catch (error) {
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    hydrateUser()
  }, [clearAuth, setUser, token, user])

  if (loading) {
    return <div className="p-8 text-slate-600">Menyiapkan sesi...</div>
  }

  if (token) {
    return <Navigate to={getAuthenticatedRedirectPath(user)} replace />
  }

  return <Outlet />
}
