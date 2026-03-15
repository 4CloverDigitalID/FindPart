import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function MatchModal({ match, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6"
    >
      <motion.div
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
      >
        <h2 className="text-4xl font-black text-slate-900">It&apos;s a Match!</h2>
        <p className="mt-3 text-slate-600">
          Kamu dan <strong>{match?.name || 'pengguna ini'}</strong> saling tertarik.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/matches/${match?.id}/chat`}
            className="flex-1 rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900"
          >
            Kirim Pesan
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Lanjut Swipe
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
