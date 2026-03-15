import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data } = await api.get('/matches')
      return data
    },
  })
}
