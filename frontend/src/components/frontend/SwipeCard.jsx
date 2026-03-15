import { motion, useMotionValue, useTransform } from 'framer-motion'

export default function SwipeCard({ card, onSwipe }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const likeOpacity = useTransform(x, [0, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-120, 0], [1, 0])

  const profile = card.startup_profile || card.talent_profile
  const badgeItems = profile?.skills || profile?.needs || []

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) {
      onSwipe('right', card.id)
      return
    }

    if (info.offset.x < -120) {
      onSwipe('left', card.id)
    }
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 right-0 mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
    >
      <motion.span
        style={{ opacity: likeOpacity }}
        className="absolute left-6 top-5 rounded-md border-2 border-green-600 px-2 py-1 text-sm font-bold text-green-600"
      >
        LIKE
      </motion.span>

      <motion.span
        style={{ opacity: nopeOpacity }}
        className="absolute right-6 top-5 rounded-md border-2 border-red-600 px-2 py-1 text-sm font-bold text-red-600"
      >
        NOPE
      </motion.span>

      <div className="flex items-center gap-4 pt-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-700">
          {card.name?.charAt(0) || '?'}
        </div>

        <div>
          <p className="text-lg font-bold text-slate-900">{card.name}</p>
          <p className="text-sm text-slate-500">{profile?.tagline || profile?.role_title || 'Profil pengguna'}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        {profile?.pitch_description || profile?.bio || 'Belum ada deskripsi tambahan.'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {badgeItems.slice(0, 6).map((item) => (
          <span key={item} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
