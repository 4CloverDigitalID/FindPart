import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { resetEcho } from '../lib/echo'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const setUser = useAuthStore((state) => state.setUser)

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/register', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data)
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/login', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/logout')
    },
    onSettled: () => {
      resetEcho()
      clearAuth()
    },
  })

  const fetchMeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/me')
      return data
    },
    onSuccess: (data) => {
      setUser(data)
    },
  })

  return {
    registerMutation,
    loginMutation,
    logoutMutation,
    fetchMeMutation,
  }
}
