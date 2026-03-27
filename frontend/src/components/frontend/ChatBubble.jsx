import React from 'react'

export default function ChatBubble({ message, isMine }) {
  // Format the ISO created_at string to HH:mm
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Extract initials
  const senderName = message?.sender?.name || 'User'
  const initials = senderName.substring(0, 2).toUpperCase()

  // WhatsApp style status flag: 'sending', 'sent', 'delivered'
  const status = message.status || (message.read_at ? 'delivered' : 'sent')
  const body = message.body || message.message || ''

  if (isMine) {
    return (
      <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
        <div style={{ fontFamily: "inter" }} className="bg-[#5f5e5e] px-5 py-4 rounded-[1.25rem] rounded-br-[4px] shadow-[0_4px_8px_rgba(0,0,0,0.05)]">
          <p className="text-[14px] leading-relaxed text-[#ffffff] break-words">{body}</p>
        </div>
        <div className="flex items-center gap-1.5 mr-1 pb-1">
          <span style={{ fontFamily: "inter" }} className="text-[10px] font-bold text-[#5f5e5e]/50 uppercase tracking-wider">
            {time}
          </span>
          {/* Status Indicator Icons */}
          {status === 'sending' && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-[#5f5e5e]/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
          {status === 'sent' && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-[#5f5e5e]/60">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          {status === 'delivered' && (
            <div className="relative flex items-center pr-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-[#fdd400]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-[#fdd400] absolute -right-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-3 max-w-[80%]">
      {/* Avatar Placeholder */}
      <div className="w-8 h-8 rounded-full bg-[#dbd8d8] flex items-center justify-center text-[#5f5e5e] font-bold mb-1 text-[11px] shrink-0">
        {initials}
      </div>
      
      <div className="space-y-1">
        <div style={{ fontFamily: "inter" }} className="bg-[#e8e8e8] px-5 py-4 rounded-[1.25rem] rounded-bl-[4px] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <p className="text-[14px] leading-relaxed text-[#1a1c1c] break-words">{body}</p>
        </div>
        <span style={{ fontFamily: "inter" }} className="text-[10px] font-bold text-[#5f5e5e]/50 ml-1 uppercase tracking-wider">
          {senderName} • {time}
        </span>
      </div>
    </div>
  )
}
