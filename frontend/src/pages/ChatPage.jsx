import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import ChatBubble from '../components/frontend/ChatBubble'
import { useChat } from '../hooks/useChat'
import { useAuthStore } from '../store/authStore'
import { useReadReceiptsStore } from '../store/readReceiptsStore'

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

export default function ChatPage() {
  const { id } = useParams()
  const matchId = Number(id)
  const user = useAuthStore((state) => state.user)
  const [body, setBody] = useState('')
  const messagesEndRef = useRef(null)
  const markAsRead = useReadReceiptsStore((state) => state.markAsRead)

  const matchQuery = useQuery({
    queryKey: ['match', matchId],
    enabled: Number.isFinite(matchId),
    queryFn: async () => {
      const { data } = await api.get(`/matches/${matchId}`)
      return data
    },
  })

  const { messages, sendMessageMutation, conversationQuery } = useChat(matchId)

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read whenever the page updates with new data
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead(matchId)
    }
  }, [messages.length, matchId, markAsRead])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!body.trim()) {
      return
    }

    try {
      // Capture the message so we can clear the input instantly
      const sentBody = body.trim()
      setBody('') // Instantly clear the input field
      
      await sendMessageMutation.mutateAsync(sentBody)
      
      // Force absolutely aggressive reload of the query directly from the view
      if (conversationQuery) await conversationQuery.refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const partner = user?.role === 'startup' ? matchQuery.data?.talent : matchQuery.data?.startup

  return (
    <div className="w-full h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 flex items-center justify-center overflow-hidden bg-slate-50/50">
      <div className="flex flex-col h-full max-h-[800px] min-h-[500px] w-full max-w-[1100px] mx-auto overflow-hidden rounded-[1.75rem] border border-[#eeeeee] bg-[#f9f9f9] shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative">
        
        {/* TopAppBar */}
        <header className="h-[72px] shrink-0 flex items-center justify-between px-6 md:px-8 w-full bg-white/60 backdrop-blur-md sticky top-0 z-10 border-b border-[#eeeeee]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#dbd8d8] flex items-center justify-center text-[#5f5e5e] font-bold text-[14px]">
                  {partner?.name ? partner.name.substring(0,2).toUpperCase() : 'U'}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#52c41a] border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 style={{ fontFamily: "poppins" }} className="text-[16px] md:text-[18px] font-extrabold text-[#1a1c1c] leading-tight">
                  {partner?.name || 'Loading...'}
                </h2>
                <p style={{ fontFamily: "inter" }} className="text-[9px] md:text-[10px] font-bold text-[#5f5e5e]/50 uppercase tracking-widest mt-0.5">
                  {partner?.role_title ? `${partner.role_title} • Active` : 'Online'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 md:mr-4 lg:mr-8">
            <span style={{ fontFamily: "inter" }} className="text-[#1a1c1c] border-b-2 border-[#fdd400] pb-1 font-bold text-[13px] tracking-wide">Direct</span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            <button className="hidden sm:block p-2 hover:bg-black/5 rounded-[0.5rem] transition-all duration-300 text-[#5f5e5e]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
            </button>
          </div>
        </header>

        {/* Message Workspace */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-7 flex flex-col no-scrollbar bg-[#f9f9f9] scroll-smooth">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p style={{ fontFamily: "inter" }} className="text-[14px] text-[#5f5e5e]/60 font-medium">
                Belum ada pesan. Mulai percakapan sekarang.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatBubble 
              key={message.id} 
              message={message} 
              isMine={message.sender_id === user?.id || message.sender?.id === user?.id} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Container */}
        <div className="p-4 md:p-6 bg-[#f9f9f9] border-t border-transparent z-10 shrink-0">
          <form className="mx-auto flex items-center gap-2 md:gap-3 bg-[#ffffff] p-2 pl-3 md:pl-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border-[1.5px] border-transparent focus-within:border-[#ffe170] transition-all" onSubmit={handleSend}>
            <button type="button" className="p-2 text-[#5f5e5e]/50 hover:text-[#5f5e5e] transition-colors rounded-full hover:bg-black/5 hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </button>
            <input
              style={{ fontFamily: "inter" }}
              className="flex-1 w-full border-none focus:ring-0 text-[14px] md:text-[14.5px] bg-transparent placeholder:text-[#5f5e5e]/40 py-2 outline-none text-[#1a1c1c]"
              placeholder="Tulis pesan..."
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
            <div className="flex items-center gap-1 md:gap-2 pr-1">
              <button type="button" className="p-2 text-[#5f5e5e]/50 hover:text-[#5f5e5e] transition-colors rounded-full hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-5 md:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>
              </button>
              <button
                type="submit"
                disabled={sendMessageMutation.isPending || !body.trim()}
                className="bg-[#fdd400] text-[#544600] p-2.5 md:p-3 rounded-xl flex items-center justify-center hover:shadow-[0_4px_12px_rgba(253,212,0,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
