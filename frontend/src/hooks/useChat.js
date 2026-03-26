import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { getEcho } from '../lib/echo'
import { useAuthStore } from '../store/authStore'

export function useChat(matchId) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  // Ensure query key explicitly casts to string to avoid mismatch bugs
  const queryKey = ['conversation', String(matchId)]

  const conversationQuery = useQuery({
    queryKey,
    enabled: Boolean(matchId),
    queryFn: async () => {
      const { data } = await api.get(`/conversations/${matchId}`)
      return data
    },
    // We want the chat layout to refresh easily when told to
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  // Set up Laravel Echo WebSocket Listener
  useEffect(() => {
    const conversationId = conversationQuery.data?.conversation_id
    if (!conversationId || !token) {
      return undefined
    }

    const echo = getEcho(token)
    if (!echo) return undefined

    const channel = echo.private(`conversation.${conversationId}`)

    const triggerUpdate = () => {
      // Upon ANY new socket event, completely invalidate the cache! 
      // This commands the browser to instantly redownload the chat.
      queryClient.invalidateQueries({ queryKey })
    }

    // We listen to both formats just in case the backend implicit routing varies
    channel.listen('.MessageSent', triggerUpdate)
    channel.listen('MessageSent', triggerUpdate)

    return () => {
      channel.stopListening('.MessageSent')
      channel.stopListening('MessageSent')
      echo.leave(`conversation.${conversationId}`)
    }
  }, [conversationQuery.data?.conversation_id, token, matchId, queryClient])

  const sendMessageMutation = useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post('/messages', {
        match_id: Number(matchId),
        body,
      })
      return data
    },
    // Fire the invalidation the very millisecond the backend confirms receipt
    onSettled: () => {
      // Destroys the cache and triggers a silent refetch
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // Direct pull from the actively updating server state
  const rawMessages = conversationQuery.data?.messages || []

  // Ensure perfect chronological ordering
  const sortedMessages = useMemo(
    () => [...rawMessages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    [rawMessages],
  )

  return {
    messages: sortedMessages,
    conversationId: conversationQuery.data?.conversation_id,
    conversationQuery,
    sendMessageMutation,
  }
}
