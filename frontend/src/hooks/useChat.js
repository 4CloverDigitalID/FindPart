import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { getEcho, subscribeEchoConnection } from '../lib/echo'
import { useAuthStore } from '../store/authStore'

function sortMessages(messages) {
  return [...messages].sort((a, b) => {
    const aTime = new Date(a.created_at || 0).getTime()
    const bTime = new Date(b.created_at || 0).getTime()
    if (aTime !== bTime) {
      return aTime - bTime
    }

    const aId = typeof a.id === 'number' ? a.id : Number.MAX_SAFE_INTEGER
    const bId = typeof b.id === 'number' ? b.id : Number.MAX_SAFE_INTEGER
    return aId - bId
  })
}

function toMessageShape(message, fallback = {}) {
  return {
    ...fallback,
    ...message,
    body: message.body || message.message || fallback.body || '',
    sender_id: message.sender_id ?? message.sender?.id ?? fallback.sender_id ?? null,
    read_at: message.read_at ?? fallback.read_at ?? null,
    created_at: message.created_at ?? fallback.created_at ?? new Date().toISOString(),
    updated_at: message.updated_at ?? fallback.updated_at ?? new Date().toISOString(),
  }
}

function upsertMessage(messages, incoming) {
  const index = messages.findIndex((item) => item.id === incoming.id)
  if (index >= 0) {
    const nextMessages = [...messages]
    nextMessages[index] = {
      ...nextMessages[index],
      ...incoming,
    }
    return sortMessages(nextMessages)
  }

  return sortMessages([...messages, incoming])
}

function normalizeConnectionError(payload) {
  if (!payload) {
    return 'Unknown realtime error'
  }

  if (typeof payload === 'string') {
    return payload
  }

  if (payload?.error?.data?.message) {
    return String(payload.error.data.message)
  }

  if (payload?.error?.message) {
    return String(payload.error.message)
  }

  if (payload?.message) {
    return String(payload.message)
  }

  if (payload?.type) {
    return `Realtime error: ${payload.type}`
  }

  return 'Unknown realtime error'
}

export function useChat(matchId) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const userId = user?.id ?? null
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['conversation', String(matchId)], [matchId])

  const [typingUserId, setTypingUserId] = useState(null)
  const [onlineUserIds, setOnlineUserIds] = useState([])
  const [connectionState, setConnectionState] = useState('idle')
  const [connectionError, setConnectionError] = useState(null)
  const isRealtimeConnected = connectionState === 'connected'

  const presenceChannelRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const lastTypingSentAtRef = useRef(0)
  const lastReadAttemptMessageIdRef = useRef(null)

  const conversationQuery = useQuery({
    queryKey,
    enabled: Boolean(matchId),
    queryFn: async () => {
      const { data } = await api.get(`/conversations/${matchId}`)
      return data
    },
    staleTime: 15000,
    refetchOnWindowFocus: false,
    refetchInterval: isRealtimeConnected ? false : 2000,
    refetchIntervalInBackground: true,
  })

  useEffect(() => {
    const unsubscribe = subscribeEchoConnection((state) => {
      setConnectionState(state)
      if (state === 'connected') {
        setConnectionError(null)
      }
    })

    return unsubscribe
  }, [])

  const setConversationCache = useCallback((updater) => {
    queryClient.setQueryData(queryKey, (previous) => {
      const base = previous || {
        conversation_id: null,
        match_id: Number(matchId),
        messages: [],
      }

      return updater(base)
    })
  }, [queryClient, queryKey, matchId])

  const rawMessages = conversationQuery.data?.messages || []
  const messages = useMemo(() => sortMessages(rawMessages), [rawMessages])

  const latestUnreadIncomingMessageId = useMemo(() => {
    if (!userId) {
      return null
    }

    let latestId = null

    messages.forEach((message) => {
      if (message.sender_id === userId || message.read_at) {
        return
      }

      if (typeof message.id === 'number' && (latestId === null || message.id > latestId)) {
        latestId = message.id
      }
    })

    return latestId
  }, [messages, userId])

  const hasUnreadIncoming = useMemo(() => {
    return latestUnreadIncomingMessageId !== null
  }, [latestUnreadIncomingMessageId])

  const markReadMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/conversations/${matchId}/read`)
      return data
    },
    onSuccess: (payload) => {
      if (!payload?.last_read_message_id || !payload?.read_at) {
        return
      }

      setConversationCache((previous) => ({
        ...previous,
        messages: previous.messages.map((message) => {
          if (message.sender_id === userId) {
            return message
          }

          if (message.read_at) {
            return message
          }

          if (typeof message.id === 'number' && message.id <= payload.last_read_message_id) {
            return {
              ...message,
              read_at: payload.read_at,
            }
          }

          return message
        }),
      }))

      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })

  useEffect(() => {
    lastReadAttemptMessageIdRef.current = null
  }, [conversationQuery.data?.conversation_id])

  const markConversationRead = useCallback(async () => {
    if (
      !conversationQuery.data?.conversation_id
      || !userId
      || !hasUnreadIncoming
      || markReadMutation.isPending
    ) {
      return
    }

    if (
      latestUnreadIncomingMessageId !== null
      && lastReadAttemptMessageIdRef.current === latestUnreadIncomingMessageId
    ) {
      return
    }

    lastReadAttemptMessageIdRef.current = latestUnreadIncomingMessageId

    try {
      await markReadMutation.mutateAsync()
    } catch (error) {
      lastReadAttemptMessageIdRef.current = null
      throw error
    }
  }, [
    conversationQuery.data?.conversation_id,
    userId,
    hasUnreadIncoming,
    latestUnreadIncomingMessageId,
    markReadMutation.isPending,
    markReadMutation.mutateAsync,
  ])

  useEffect(() => {
    markConversationRead().catch(() => {})
  }, [markConversationRead])

  const sendMessageMutation = useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post('/messages', {
        match_id: Number(matchId),
        body,
      })
      return data
    },
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData(queryKey)
      const optimisticId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`
      const optimisticMessage = toMessageShape({
        id: optimisticId,
        conversation_id: conversationQuery.data?.conversation_id || null,
        match_id: Number(matchId),
        body,
        sender_id: userId,
        sender: user
          ? {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            }
          : null,
        read_at: null,
        status: 'sending',
        optimistic: true,
      })

      setConversationCache((current) => ({
        ...current,
        messages: sortMessages([...(current.messages || []), optimisticMessage]),
      }))

      return { previous, optimisticId }
    },
    onSuccess: (serverMessage, _body, context) => {
      const normalizedServerMessage = toMessageShape(serverMessage, {
        status: serverMessage?.read_at ? 'delivered' : 'sent',
      })

      setConversationCache((current) => {
        const withoutOptimistic = (current.messages || []).filter(
          (message) => message.id !== context?.optimisticId,
        )

        return {
          ...current,
          conversation_id:
            current.conversation_id || normalizedServerMessage.conversation_id || null,
          messages: upsertMessage(withoutOptimistic, normalizedServerMessage),
        }
      })

      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
    onError: (_error, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
        return
      }

      if (context?.optimisticId) {
        setConversationCache((current) => ({
          ...current,
          messages: (current.messages || []).filter((message) => message.id !== context.optimisticId),
        }))
      }
    },
  })

  const sendTyping = useCallback(() => {
    if (!userId || !presenceChannelRef.current) {
      return
    }

    const now = Date.now()
    if (now - lastTypingSentAtRef.current < 1200) {
      return
    }

    lastTypingSentAtRef.current = now
    presenceChannelRef.current.whisper('typing', {
      user_id: userId,
      at: new Date(now).toISOString(),
    })
  }, [userId])

  useEffect(() => {
    const conversationId = conversationQuery.data?.conversation_id
    if (!conversationId || !token) {
      return undefined
    }

    const echo = getEcho(token)
    if (!echo) {
      return undefined
    }

    const privateChannelName = `conversation.${conversationId}`
    const presenceChannelName = `conversation.presence.${conversationId}`
    const privateChannel = echo.private(privateChannelName)

    const onMessageSent = (event) => {
      const incoming = toMessageShape(event, {
        status: event?.read_at ? 'delivered' : 'sent',
      })

      setConversationCache((current) => ({
        ...current,
        conversation_id: current.conversation_id || incoming.conversation_id || conversationId,
        messages: upsertMessage(current.messages || [], incoming),
      }))

      queryClient.invalidateQueries({ queryKey: ['matches'] })
    }

    const onMessageRead = (event) => {
      if (!event?.last_read_message_id || !event?.read_at) {
        return
      }

      setConversationCache((current) => ({
        ...current,
        messages: (current.messages || []).map((message) => {
          if (message.sender_id !== userId || message.read_at) {
            return message
          }

          if (typeof message.id === 'number' && message.id <= event.last_read_message_id) {
            return {
              ...message,
              read_at: event.read_at,
              status: 'delivered',
            }
          }

          return message
        }),
      }))

      queryClient.invalidateQueries({ queryKey: ['matches'] })
    }

    privateChannel.listen('.MessageSent', onMessageSent)
    privateChannel.listen('.MessageRead', onMessageRead)

    const presenceChannel = echo.join(presenceChannelName)
    presenceChannelRef.current = presenceChannel

    presenceChannel
      .here((members) => {
        const ids = members
          .map((member) => member.id)
          .filter((memberId) => memberId !== userId)
        setOnlineUserIds(ids)
      })
      .joining((member) => {
        if (member.id === userId) {
          return
        }

        setOnlineUserIds((previous) => (
          previous.includes(member.id) ? previous : [...previous, member.id]
        ))
      })
      .leaving((member) => {
        setOnlineUserIds((previous) => previous.filter((id) => id !== member.id))
      })
      .listenForWhisper('typing', (payload) => {
        if (!payload?.user_id || payload.user_id === userId) {
          return
        }

        setTypingUserId(payload.user_id)

        if (typingTimeoutRef.current) {
          window.clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = window.setTimeout(() => {
          setTypingUserId(null)
        }, 1800)
      })

    const pusherConnection = echo?.connector?.pusher?.connection
    const onConnected = () => {
      setConnectionError(null)
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    }
    const onConnectionError = (error) => {
      setConnectionError(normalizeConnectionError(error))
    }
    const onConnectionUnavailable = () => {
      setConnectionError('Realtime unavailable')
    }

    if (pusherConnection) {
      pusherConnection.bind('connected', onConnected)
      pusherConnection.bind('error', onConnectionError)
      pusherConnection.bind('unavailable', onConnectionUnavailable)
    }

    if (typeof privateChannel.error === 'function') {
      privateChannel.error(onConnectionError)
    }

    if (typeof presenceChannel.error === 'function') {
      presenceChannel.error(onConnectionError)
    }

    return () => {
      privateChannel.stopListening('.MessageSent')
      privateChannel.stopListening('.MessageRead')
      echo.leave(privateChannelName)
      echo.leave(presenceChannelName)
      presenceChannelRef.current = null
      setOnlineUserIds([])
      setTypingUserId(null)

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }

      if (pusherConnection) {
        pusherConnection.unbind('connected', onConnected)
        pusherConnection.unbind('error', onConnectionError)
        pusherConnection.unbind('unavailable', onConnectionUnavailable)
      }
    }
  }, [
    conversationQuery.data?.conversation_id,
    queryKey,
    queryClient,
    setConversationCache,
    token,
    userId,
  ])

  return {
    messages,
    conversationId: conversationQuery.data?.conversation_id,
    conversationQuery,
    sendMessageMutation,
    markConversationRead,
    markReadMutation,
    sendTyping,
    onlineUserIds,
    typingUserId,
    connectionState,
    connectionError,
  }
}
