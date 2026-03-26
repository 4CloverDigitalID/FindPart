import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import MatchModal from '../components/frontend/MatchModal'
import SwipeCard from '../components/frontend/SwipeCard'
import { useSwipe } from '../hooks/useSwipe'
import { getEcho } from '../lib/echo'
import { useAuthStore } from '../store/authStore'
import {
  SlidersHorizontal, X, Heart, RotateCcw, Zap,
  MapPin, Briefcase, Star, TrendingUp, Users, ChevronDown, ChevronUp
} from 'lucide-react'


import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

// ── Helpers ──────────────────────────────────────────────────────────────────
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

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ user, size = 64 }) {
  const src = getAvatar(user)
  const name = user?.name || '?'
  const colors = ['from-yellow-400 to-amber-500', 'from-orange-400 to-yellow-500', 'from-amber-400 to-orange-400']
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{ width: size, height: size }} className="rounded-full overflow-hidden shrink-0 ring-2 ring-yellow-400 ring-offset-2">
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-black`} style={{ fontSize: size * 0.33 }}>{initials(name)}</div>
      }
    </div>
  )
}

// ── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, color }) {
  return (
    <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl border ${color}`}>
      <Icon size={15} />
      <div>
        <div className="text-md font-black leading-none">{value}</div>
        <div className="text-[11px] font-medium opacity-60 mt-0.5">{label}</div>
      </div>
    </div>
  )
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
function FilterInput({ placeholder, value, onChange, type = 'text', min }) {
  return (
    <input
      type={type}
      min={min}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-yellow-400 transition-all"
    />
  )
}

function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-yellow-400 transition-all appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ── Action Button ─────────────────────────────────────────────────────────────
function ActionBtn({ onClick, icon: Icon, label, variant }) {
  const styles = {
    pass: 'bg-white border-2 border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:scale-105',
    like: 'bg-yellow-400 border-2 border-yellow-400 text-black hover:bg-yellow-500 hover:scale-105',
    undo: 'bg-white border-2 border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:scale-105',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col cursor-pointer items-center gap-1.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-150 shadow-sm ${styles[variant]}`}
    >
      <Icon size={variant === 'like' ? 22 : 18} />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ onReset }) {
  return (
    <div style={{ fontFamily: "inter" }} className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
      <div className="w-20 h-20 rounded-3xl bg-yellow-100 flex items-center justify-center">
        <Zap size={32} className="text-yellow-500" />
      </div>
      <div>
        <div className="text-lg font-black text-gray-800 mb-1">Semua sudah dilihat!</div>
        <div className="text-sm text-gray-400">Coba ubah filter untuk menemukan lebih banyak orang.</div>
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-2 cursor-pointer bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-colors"
      >
        <RotateCcw size={15} /> Reset Filter
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function SwipePage() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const token = useAuthStore((state) => state.token)

  const [cards, setCards] = useState([])
  const [filters, setFilters] = useState({
    industry: '', stage: '', location: '', skills: '', work_type: '', experience_min: '',
  })
  const [liveMatch, setLiveMatch] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sessionStats, setSessionStats] = useState({ likes: 0, passes: 0 })

  const swipeMutation = useSwipe()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => { const { data } = await api.get('/me'); return data },
  })

  useEffect(() => {
    if (meQuery.data) setUser(meQuery.data)
  }, [meQuery.data, setUser])

  const activeUser = meQuery.data || user

  const discoverQuery = useQuery({
    queryKey: ['discover', filters, activeUser?.role],
    enabled: Boolean(activeUser?.role),
    queryFn: async () => {
      const { data } = await api.get('/discover', { params: filters })
      return data
    },
  })

  useEffect(() => {
    setCards(discoverQuery.data?.data || [])
  }, [discoverQuery.data])

  useEffect(() => {
    if (!activeUser?.id || !token) return undefined
    const echo = getEcho(token)
    if (!echo) return undefined
    const channel = echo.private(`users.${activeUser.id}`)
    channel.listen('.MatchCreated', (event) => {
      const partner = activeUser.role === 'startup' ? event.talent : event.startup
      setLiveMatch({ id: event.id, name: partner?.name || 'pengguna baru' })
    })
    return () => {
      channel.stopListening('.MatchCreated')
      echo.leave(`users.${activeUser.id}`)
    }
  }, [activeUser, token])

  const currentCard = cards[0]
  const totalSeen = sessionStats.likes + sessionStats.passes
  const matchRate = totalSeen > 0 ? Math.round((sessionStats.likes / totalSeen) * 100) : 0

  const roleFilterKeys = useMemo(() => {
    if (activeUser?.role === 'talent') return ['industry', 'stage', 'location']
    return ['skills', 'work_type', 'experience_min']
  }, [activeUser?.role])

  const handleSwipe = async (direction, swipedId) => {
    if (!activeUser) return
    setSessionStats((prev) => ({
      ...prev,
      likes: direction === 'right' ? prev.likes + 1 : prev.likes,
      passes: direction === 'left' ? prev.passes + 1 : prev.passes,
    }))
    try {
      const response = await swipeMutation.mutateAsync({ direction, swipedId })
      setCards((prev) => prev.filter((card) => card.id !== swipedId))
      if (response.match && response.match_id) {
        const { data } = await api.get(`/matches/${response.match_id}`)
        const partner = activeUser.role === 'startup' ? data.talent : data.startup
        setLiveMatch({ id: response.match_id, name: partner?.name || 'pengguna baru' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setFilters({ industry: '', stage: '', location: '', skills: '', work_type: '', experience_min: '' })
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  if (meQuery.isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-300 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div style={{ fontFamily: "inter" }}>
          <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {activeUser?.role === 'talent' ? 'Temukan startup yang cocok untukmu' : 'Temukan talent terbaik untuk timmu'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Session Stats */}
          <div className="hidden sm:flex items-center gap-2">
            <StatPill icon={Heart} value={sessionStats.likes} label="Liked" color="bg-yellow-50 border-yellow-200 text-yellow-700" />
            <StatPill icon={TrendingUp} value={`${matchRate}%`} label="Match rate" color="bg-green-50 border-green-200 text-green-700" />
            <StatPill icon={Users} value={cards.length} label="Tersisa" color="bg-blue-50 border-blue-200 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── LEFT: Swipe Area ── */}
        <div className="space-y-4">

          {/* Card Container */}
          <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{ minHeight: 540 }}>

            {/* Decorative background circles */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-yellow-100/50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-amber-100/40 translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Stack indicator (fake behind cards) */}
            {cards.length > 2 && (
              <div className="absolute inset-x-6 top-6 h-full rounded-2xl bg-yellow-100/60 border border-yellow-200/60 rotate-3 pointer-events-none z-0" />
            )}
            {cards.length > 1 && (
              <div className="absolute inset-x-4 top-4 h-full rounded-2xl bg-yellow-50 border border-yellow-200/40 rotate-1 pointer-events-none z-[1]" />
            )}

            {/* Main Card */}
            <div className="relative z-[2] p-5 h-full" style={{ minHeight: 540 }}>
              {discoverQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3" style={{ minHeight: 460 }}>
                  <div className="w-10 h-10 border-2 border-yellow-300 border-t-yellow-500 rounded-full animate-spin" />
                  <div className="text-sm text-gray-400">Mencari orang...</div>
                </div>
              ) : !currentCard ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <SwipeCard card={currentCard} onSwipe={handleSwipe} />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {currentCard && (
            <div className="flex items-center justify-center gap-4 py-2">
              <ActionBtn
                onClick={() => handleSwipe('left', currentCard.id)}
                icon={X}
                label="Pass"
                variant="pass"
              />
              <ActionBtn
                onClick={() => handleSwipe('right', currentCard.id)}
                icon={Heart}
                label="Like"
                variant="like"
              />
            </div>
          )}

          {/* Mobile stats */}
          <div className="flex sm:hidden items-center justify-center gap-3 flex-wrap">
            <StatPill icon={Heart} value={sessionStats.likes} label="Liked" color="bg-yellow-50 border-yellow-200 text-yellow-700" />
            <StatPill icon={TrendingUp} value={`${matchRate}%`} label="Match rate" color="bg-green-50 border-green-200 text-green-700" />
            <StatPill icon={Users} value={cards.length} label="Tersisa" color="bg-blue-50 border-blue-200 text-blue-600" />
          </div>
        </div>

        {/* ── RIGHT: Filters + Tips ── */}
        <div className="space-y-4">

          {/* Filter Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Filter Header */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <SlidersHorizontal size={14} className="text-yellow-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-800">Filter Discovery</div>
                  <div className="text-xs text-gray-400">
                    {activeFilterCount > 0 ? `${activeFilterCount} filter aktif` : 'Tidak ada filter'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
                {showFilters ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </button>

            {/* Filter Body */}
            {showFilters && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
                <div className="pt-4 space-y-3">
                  {roleFilterKeys.includes('industry') && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Industri</label>
                      <FilterInput placeholder="e.g. Fintech, EdTech" value={filters.industry} onChange={(v) => handleFilterChange('industry', v)} />
                    </div>
                  )}
                  {roleFilterKeys.includes('stage') && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Stage Startup</label>
                      <FilterSelect
                        value={filters.stage}
                        onChange={(v) => handleFilterChange('stage', v)}
                        placeholder="Semua Stage"
                        options={[
                          { value: 'idea', label: '💡 Idea' },
                          { value: 'mvp', label: '🚀 MVP' },
                          { value: 'growth', label: '📈 Growth' },
                          { value: 'scaling', label: '⚡ Scaling' },
                        ]}
                      />
                    </div>
                  )}
                  {roleFilterKeys.includes('location') && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Lokasi</label>
                      <FilterInput placeholder="e.g. Jakarta, Bandung" value={filters.location} onChange={(v) => handleFilterChange('location', v)} />
                    </div>
                  )}
                  {roleFilterKeys.includes('skills') && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Skills</label>
                      <FilterInput placeholder="e.g. React, Laravel, UI/UX" value={filters.skills} onChange={(v) => handleFilterChange('skills', v)} />
                    </div>
                  )}
                  {roleFilterKeys.includes('work_type') && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tipe Kerja</label>
                      <FilterSelect
                        value={filters.work_type}
                        onChange={(v) => handleFilterChange('work_type', v)}
                        placeholder="Semua Tipe"
                        options={[
                          { value: 'remote', label: '🏠 Remote' },
                          { value: 'onsite', label: '🏢 On-site' },
                          { value: 'hybrid', label: '🔄 Hybrid' },
                        ]}
                      />
                    </div>
                  )}
                  {roleFilterKeys.includes('experience_min') && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Minimal Pengalaman (tahun)</label>
                      <FilterInput type="number" min={0} placeholder="0" value={filters.experience_min} onChange={(v) => handleFilterChange('experience_min', v)} />
                    </div>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="w-full text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors mt-1 py-1"
                  >
                    Reset semua filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* How to Swipe Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Tips Swipe</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: Heart, color: 'text-yellow-500 bg-yellow-50', text: 'Tap Like kalau kamu tertarik untuk berkolaborasi' },
                { icon: X, color: 'text-red-400 bg-red-50', text: 'Tap Pass kalau tidak sesuai dengan kebutuhanmu' },
                { icon: Zap, color: 'text-blue-400 bg-blue-50', text: 'Match terjadi kalau kedua pihak saling Like!' },
              ].map(({ icon: Icon, color, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={13} />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar today */}
          <div style={{ fontFamily: "inter" }} className="bg-yellow-400 rounded-2xl p-5 text-black">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: "inter" }} className="text-md font-semibold">Aktivitas Sesi Ini</span>
              <Zap size={16} />
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <div className="text-xl font-semibold">{totalSeen}</div>
                <div className="text-[10px] font-semibold opacity-70">Dilihat</div>
              </div>
              <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black/30 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalSeen / 20) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs font-semibold opacity-70">Goal: 20</div>
            </div>
            <p className="text-xs opacity-70">
              {totalSeen === 0
                ? 'Mulai swipe untuk menemukan match pertamamu!'
                : totalSeen < 5
                ? 'Bagus! Terus semangat.'
                : totalSeen < 10
                ? 'Kamu lagi panas nih 🔥'
                : 'Luar biasa! Kamu aktif banget hari ini!'}
            </p>
          </div>

        </div>
      </div>

      {liveMatch && <MatchModal match={liveMatch} onClose={() => setLiveMatch(null)} />}
    </div>
  )
}