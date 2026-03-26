import { Link } from 'react-router-dom'
import { useMatches } from '../hooks/useMatches'
import { useAuthStore } from '../store/authStore'
import { useReadReceiptsStore } from '../store/readReceiptsStore'
import { MessageCircle, Zap, Users, ChevronRight, Clock, Flame } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────
const getAvatar = (user) => {
  if (!user) return null
  if (user.avatar) {
    return user.avatar.startsWith('http')
      ? user.avatar
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${user.avatar}`
  }
  return null
}

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

const AVATAR_COLORS = [
  { from: '#F59E0B', to: '#F97316' },
  { from: '#FBBF24', to: '#EF9F27' },
  { from: '#F97316', to: '#FBBF24' },
  { from: '#EF9F27', to: '#F59E0B' },
]

function getAvatarColor(name = '') {
  const c = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]
  return `linear-gradient(135deg, ${c.from}, ${c.to})`
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m}m lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}j lalu`
  return `${Math.floor(h / 24)}h lalu`
}

// ── Avatar component ──────────────────────────────────────────────────────────
function Avatar({ user, size = 52 }) {
  const src = getAvatar(user)
  const name = user?.name || '?'
  return (
    <div
      style={{ width: size, height: size, flexShrink: 0 }}
      className="rounded-2xl overflow-hidden"
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-black text-black"
          style={{ background: getAvatarColor(name), fontSize: size * 0.33 }}
        >
          {initials(name)}
        </div>
      )}
    </div>
  )
}

// ── Skill tags ────────────────────────────────────────────────────────────────
function SkillTag({ label }) {
  return (
    <span className="px-2.5 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-[10px] font-semibold whitespace-nowrap">
      {label}
    </span> 
  )
}

// ── Match Card ────────────────────────────────────────────────────────────────
function MatchCard({ match, user, readTimestamps }) {
  const partner = user?.role === 'startup' ? match.talent : match.startup
  const profile = partner?.startup_profile || partner?.talent_profile
  const isStartup = !!partner?.startup_profile

  const subtitle = profile?.tagline || profile?.role_title || 'Profil belum lengkap'
  const skills = (profile?.skills || profile?.needs || []).slice(0, 3)
  const location = profile?.location || null

  const conversation = match.conversation
  const messages = conversation?.messages || []
  const lastMsg = messages[messages.length - 1]
  const lastRead = readTimestamps[match.id]
  const isUnread =
    lastMsg &&
    lastMsg.sender_id !== user?.id &&
    (!lastRead || new Date(lastMsg.created_at) > new Date(lastRead))

  const matchedAt = match.matched_at || match.created_at

  return (
    <article
      className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden
        hover:shadow-md hover:-translate-y-0.5
        ${isUnread ? 'border-yellow-400 shadow-sm shadow-yellow-100' : 'border-gray-100 shadow-sm'}`}
    >
      {/* Unread accent strip */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-2xl" />
      )}

      <div className="p-5 pl-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar user={partner} size={54} />
            {/* Online dot */}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900 text-base leading-tight truncate">
                    {partner?.name || 'Pengguna'}
                  </h3>
                  {isUnread && (
                    <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{subtitle}</p>
              </div>
              <span className="text-[10px] text-gray-300 font-medium shrink-0 mt-1">
                {timeAgo(matchedAt)}
              </span>
            </div>

            {/* Last message preview */}
            {lastMsg ? (
              <div className={`text-xs mt-2 truncate ${isUnread ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}>
                {lastMsg.sender_id === user?.id ? (
                  <span className="text-gray-300 mr-1">Kamu:</span>
                ) : null}
                {lastMsg.message || lastMsg.content || '—'}
              </div>
            ) : (
              <div className="text-xs mt-2 text-gray-300 italic">Belum ada pesan. Mulai duluan!</div>
            )}

            {/* Skills + info row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* Role badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold
                ${isStartup ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                {isStartup ? <Zap size={9} /> : <Users size={9} />}
                {isStartup ? 'Startup' : 'Talent'}
              </span>
              {skills.map((s) => <SkillTag key={s} label={s} />)}
              {location && (
                <span className="text-[10px] text-gray-400 font-medium">📍 {location}</span>
              )}
            </div>
          </div>
        </div>

        {/* Divider + action */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-medium">
            <Clock size={10} />
            Match {timeAgo(matchedAt)}
          </div>
          <Link
            to={`/matches/${match.id}/chat`}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <MessageCircle size={13} />
            {lastMsg ? 'Buka Chat' : 'Kirim Pesan'}
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-20 h-20 rounded-3xl bg-yellow-100 flex items-center justify-center">
        <Flame size={32} className="text-yellow-500" />
      </div>
      <div>
        <div className="text-lg font-black text-gray-800 mb-1">Belum ada match</div>
        <div className="text-sm text-gray-400 max-w-xs">
          Mulai swipe di halaman Discover untuk menemukan koneksi pertamamu!
        </div>
      </div>
      <Link
        to="/swipe"
        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-colors"
      >
        <Zap size={15} /> Mulai Discover
      </Link>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function MatchesPage() {
  const user = useAuthStore((state) => state.user)
  const matchesQuery = useMatches()
  const { readTimestamps } = useReadReceiptsStore()

  if (matchesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-2 border-yellow-300 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (matchesQuery.isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-sm text-red-400 font-medium">Gagal memuat matches.</div>
      </div>
    )
  }

  const matches = matchesQuery.data?.data || []
  const unreadCount = matches.filter((m) => {
    const msgs = m.conversation?.messages || []
    const last = msgs[msgs.length - 1]
    const lastRead = readTimestamps[m.id]
    return last && last.sender_id !== user?.id && (!lastRead || new Date(last.created_at) > new Date(lastRead))
  }).length

  return (
    <div style={{ fontFamily: "inter" }} className="p-6 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Matches</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {matches.length > 0
              ? `${matches.length} koneksi ditemukan`
              : 'Temukan koneksimu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-2xl">
            <MessageCircle size={14} />
            <span className="text-sm font-black">{unreadCount} belum dibaca</span>
          </div>
        )}
      </div>

      {/* ── Stats row ── */}
      {matches.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Match', value: matches.length, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            { label: 'Belum Dibaca', value: unreadCount, color: 'bg-red-50 border-red-200 text-red-500' },
            { label: 'Sudah Chat', value: matches.filter(m => (m.conversation?.messages || []).length > 0).length, color: 'bg-green-50 border-green-200 text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border px-4 py-3 text-center ${color}`}>
              <div className="text-2xl font-black">{value}</div>
              <div className="text-[10px] font-semibold opacity-70 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Match List ── */}
      {matches.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {/* Unread first */}
          {matches
            .slice()
            .sort((a, b) => {
              const aLast = (a.conversation?.messages || []).slice(-1)[0]
              const bLast = (b.conversation?.messages || []).slice(-1)[0]
              const aUnread = aLast && aLast.sender_id !== user?.id && (!readTimestamps[a.id] || new Date(aLast.created_at) > new Date(readTimestamps[a.id]))
              const bUnread = bLast && bLast.sender_id !== user?.id && (!readTimestamps[b.id] || new Date(bLast.created_at) > new Date(readTimestamps[b.id]))
              if (aUnread && !bUnread) return -1
              if (!aUnread && bUnread) return 1
              return new Date(b.matched_at || b.created_at) - new Date(a.matched_at || a.created_at)
            })
            .map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                user={user}
                readTimestamps={readTimestamps}
              />
            ))}
        </div>
      )}
    </div>
  )
}