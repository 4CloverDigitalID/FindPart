import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { MapPin, Briefcase, Clock, ChevronDown, ChevronUp, Star, Zap } from 'lucide-react'

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

function getColor(name = '') {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]
}

// ── Cover background patterns per role ───────────────────────────────────────
const STARTUP_PATTERNS = [
  'from-yellow-400 via-amber-400 to-orange-300',
  'from-amber-300 via-yellow-400 to-yellow-500',
  'from-orange-300 via-amber-400 to-yellow-400',
]

const TALENT_PATTERNS = [
  'from-yellow-300 via-amber-200 to-yellow-100',
  'from-amber-200 via-yellow-300 to-amber-300',
  'from-yellow-200 via-amber-300 to-orange-200',
]

function getCoverPattern(name = '', role = '') {
  const patterns = role === 'startup' ? STARTUP_PATTERNS : TALENT_PATTERNS
  return patterns[(name.charCodeAt(0) || 0) % patterns.length]
}

// ── Info badge ────────────────────────────────────────────────────────────────
function InfoBadge({ icon: Icon, text, color = 'text-gray-500 bg-gray-100' }) {
  if (!text) return null
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
      <Icon size={11} />
      {text}
    </div>
  )
}

// ── Skill tag ─────────────────────────────────────────────────────────────────
function SkillTag({ label }) {
  return (
    <span className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
      {label}
    </span>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SWIPE CARD
// ══════════════════════════════════════════════════════════════════════════════
export default function SwipeCard({ card, onSwipe }) {
  const [expanded, setExpanded] = useState(false)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-12, 12])

  // LIKE / NOPE label opacity
  const likeOpacity = useTransform(x, [20, 110], [0, 1])
  const nopeOpacity = useTransform(x, [-110, -20], [1, 0])

  // Tint overlay color while dragging
  const likeOverlay = useTransform(x, [0, 110], [0, 0.12])
  const nopeOverlay = useTransform(x, [-110, 0], [0.12, 0])

  const profile = card.startup_profile || card.talent_profile
  const isStartup = !!card.startup_profile
  const role = isStartup ? 'startup' : 'talent'

  const badgeItems = profile?.skills || profile?.needs || []
  const avatarSrc = getAvatar(card)
  const avatarColor = getColor(card.name)
  const coverPattern = getCoverPattern(card.name, role)

  const bio = profile?.pitch_description || profile?.bio || null
  const tagline = profile?.tagline || profile?.role_title || null
  const location = profile?.location || null
  const workType = profile?.work_type || null
  const experienceYears = profile?.experience_years || null
  const industry = profile?.industry || null
  const stage = profile?.stage || null

  const handleDragEnd = (_, info) => {
    const threshold = 120
    if (info.offset.x > threshold) {
      animate(x, 600, { duration: 0.3 })
      setTimeout(() => onSwipe('right', card.id), 250)
    } else if (info.offset.x < -threshold) {
      animate(x, -600, { duration: 0.3 })
      setTimeout(() => onSwipe('left', card.id), 250)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 })
    }
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute top-0 left-0 right-0 mx-auto w-full max-w-sm cursor-grab select-none"
    >
      {/* ── Card Shell ── */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)' }}>

        {/* ── LIKE overlay tint ── */}
        <motion.div
          style={{ opacity: likeOverlay }}
          className="absolute inset-0 bg-green-400 z-10 pointer-events-none rounded-3xl"
        />
        {/* ── NOPE overlay tint ── */}
        <motion.div
          style={{ opacity: nopeOverlay }}
          className="absolute inset-0 bg-red-400 z-10 pointer-events-none rounded-3xl"
        />

        {/* ── LIKE / NOPE stamp ── */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute left-5 top-5 z-20 rotate-[-20deg]"
        >
          <div className="border-[3px] border-green-500 rounded-xl px-3 py-1">
            <span className="text-green-500 font-black text-xl tracking-widest">LIKE</span>
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute right-5 top-5 z-20 rotate-[20deg]"
        >
          <div className="border-[3px] border-red-500 rounded-xl px-3 py-1">
            <span className="text-red-500 font-black text-xl tracking-widest">NOPE</span>
          </div>
        </motion.div>

        {/* ── Cover Area ── */}
        <div className={`relative h-36 bg-gradient-to-br ${coverPattern} overflow-hidden`}>
          {/* Decorative shapes */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
          <div className="absolute bottom-0 left-8 w-20 h-20 rounded-full bg-black/5" />
          <div className="absolute top-4 right-12 w-12 h-12 rounded-full bg-white/15" />

          {/* Role badge top-right */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm
              ${isStartup ? 'bg-black/20 text-black' : 'bg-black/15 text-black'}`}>
              {isStartup ? <Zap size={10} /> : <Star size={10} />}
              {isStartup ? 'Startup' : 'Talent'}
            </div>
          </div>

          {/* Card count indicator dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0,1,2].map((i) => (
              <div key={i} className={`rounded-full transition-all ${i === 0 ? 'w-4 h-1.5 bg-black/40' : 'w-1.5 h-1.5 bg-black/20'}`} />
            ))}
          </div>
        </div>

        {/* ── Avatar — overlapping cover ── */}
        <div style={{ fontFamily: "inter" }} className="relative px-5">
          <div className="absolute -top-9 left-5">
            <div className="p-1 bg-white rounded-2xl shadow-md">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={card.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center font-semibold text-black text-xl"
                  style={{ background: `linear-gradient(135deg, ${avatarColor.from}, ${avatarColor.to})` }}
                >
                  {initials(card.name)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="pt-12 px-5 pb-5">

          {/* Name + tagline */}
          <div style={{ fontFamily: "inter" }} className="mb-3">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">{card.name}</h3>
            {tagline && (
              <p className="text-sm text-gray-500 font-medium mt-0.5">{tagline}</p>
            )}
          </div>

          {/* Info badges row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {location && <InfoBadge icon={MapPin} text={location} color="text-blue-600 bg-blue-50" />}
            {industry && <InfoBadge icon={Briefcase} text={industry} color="text-purple-600 bg-purple-50" />}
            {stage && <InfoBadge icon={Zap} text={stage.toUpperCase()} color="text-amber-700 bg-amber-50" />}
            {workType && <InfoBadge icon={Clock} text={workType} color="text-green-600 bg-green-50" />}
            {experienceYears && (
              <InfoBadge icon={Star} text={`${experienceYears} yr exp`} color="text-gray-600 bg-gray-100" />
            )}
          </div>

          {/* Bio — collapsed by default, expandable */}
          {bio && (
            <div className="mb-4">
              <p className={`text-sm text-gray-600 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
                {bio}
              </p>
              {bio.length > 80 && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
                  className="flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700 mt-1 transition-colors"
                >
                  {expanded ? (
                    <><ChevronUp size={12} /> Tutup</>
                  ) : (
                    <><ChevronDown size={12} /> Baca selengkapnya</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Skills / Needs */}
          {badgeItems.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {isStartup ? 'Looking for' : 'Skills'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {badgeItems.slice(0, 6).map((item) => (
                  <SkillTag key={item} label={item} />
                ))}
                {badgeItems.length > 6 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-semibold">
                    +{badgeItems.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom drag hint ── */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <span className="text-[10px] text-gray-300 font-medium">← Geser untuk pass</span>
          <span className="text-[10px] text-gray-300 font-medium">Geser untuk like →</span>
        </div>
      </div>
    </motion.div>
  )
}