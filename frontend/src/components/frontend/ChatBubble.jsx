export default function ChatBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isMine ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-800'
        }`}
      >
        {!isMine && <p className="mb-1 text-xs font-semibold text-slate-600">{message?.sender?.name || 'User'}</p>}
        <p>{message.body}</p>
      </div>
    </div>
  )
}
