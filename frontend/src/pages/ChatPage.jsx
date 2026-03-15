import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import AppShell from '../components/frontend/AppShell'
import ChatBubble from '../components/frontend/ChatBubble'
import { useChat } from '../hooks/useChat'
import { useAuthStore } from '../store/authStore'

export default function ChatPage() {
  const { id } = useParams()
  const matchId = Number(id)
  const user = useAuthStore((state) => state.user)
  const [body, setBody] = useState('')

  const matchQuery = useQuery({
    queryKey: ['match', matchId],
    enabled: Number.isFinite(matchId),
    queryFn: async () => {
      const { data } = await api.get(`/matches/${matchId}`)
      return data
    },
  })

  const { messages, sendMessageMutation } = useChat(matchId)

  const handleSend = async (event) => {
    event.preventDefault()
    if (!body.trim()) {
      return
    }

    await sendMessageMutation.mutateAsync(body.trim())
    setBody('')
  }

  const partner = user?.role === 'startup' ? matchQuery.data?.talent : matchQuery.data?.startup

  return (
    <AppShell title={`Chat: ${partner?.name || `Match #${matchId}`}`}>
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4 h-[420px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 p-4">
          {messages.length === 0 && <p className="text-sm text-slate-500">Belum ada pesan. Mulai percakapan sekarang.</p>}

          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} isMine={message.sender_id === user?.id || message.sender?.id === user?.id} />
          ))}
        </div>

        <form className="flex gap-2" onSubmit={handleSend}>
          <input
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2"
            placeholder="Tulis pesan..."
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Kirim
          </button>
        </form>
      </section>
    </AppShell>
  )
}
