import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'

export function useSwipe() {
  return useMutation({
    mutationFn: async ({ swipedId, direction }) => {
      const { data } = await api.post('/swipe', {
        swiped_id: swipedId,
        direction,
      })

      return data
    },
  })
}
