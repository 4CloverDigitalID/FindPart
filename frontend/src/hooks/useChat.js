import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { getEcho } from '../lib/echo'
import { useAuthStore } from '../store/authStore'

export function useChat(matchId) {
  const token = useAuthStore((state) => state.token)
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)

  const conversationQuery = useQuery({
    queryKey: ['conversation', matchId],
    enabled: Boolean(matchId),
    queryFn: async () => {
      const { data } = await api.get(`/conversations/${matchId}`)
      return data
    },
  })

  useEffect(() => {
    if (conversationQuery.data) {
      setConversationId(conversationQuery.data.conversation_id)
      setMessages(conversationQuery.data.messages || [])
    }
  }, [conversationQuery.data])

  useEffect(() => {
    if (!conversationId || !token) {
      return undefined
    }

    const echo = getEcho(token)

    if (!echo) {
      return undefined
    }

    const channel = echo.private(`conversation.${conversationId}`)

    const pushMessage = (event) => {
      const incomingMessage = {
        id: event.id,
        body: event.body,
        sender: event.sender,
        created_at: event.created_at,
      }

      setMessages((prev) => {
        if (prev.some((message) => message.id === incomingMessage.id)) {
          return prev
        }

        return [...prev, incomingMessage]
      })
    }

    channel.listen('.MessageSent', pushMessage)

    return () => {
      channel.stopListening('.MessageSent')
      echo.leave(`conversation.${conversationId}`)
    }
  }, [conversationId, token])

  const sendMessageMutation = useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post('/messages', {
        match_id: Number(matchId),
        body,
      })
      return data
    },
    onSuccess: (newMessage) => {
      setMessages((prev) => {
        if (prev.some((message) => message.id === newMessage.id)) {
          return prev
        }

        return [...prev, newMessage]
      })
    },
  })

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    [messages],
  )

  return {
    messages: sortedMessages,
    conversationId,
    conversationQuery,
    sendMessageMutation,
  }
}
