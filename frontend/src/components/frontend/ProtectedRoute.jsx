import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const location = useLocation()
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

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (loading) {
    return <div className="p-8 text-slate-600">Menyiapkan sesi...</div>
  }

  return <Outlet />
}
