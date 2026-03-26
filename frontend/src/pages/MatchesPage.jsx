import { Link } from 'react-router-dom'
import AppShell from '../components/frontend/AppShell'
import { useMatches } from '../hooks/useMatches'
import { useAuthStore } from '../store/authStore'

export default function MatchesPage() {
  const user = useAuthStore((state) => state.user)
  const matchesQuery = useMatches()

  if (matchesQuery.isLoading) {
    return <AppShell title="Matches">Memuat matches...</AppShell>
  }

  if (matchesQuery.isError) {
    return <AppShell title="Matches">Gagal memuat matches.</AppShell>
  }

  const matches = matchesQuery.data?.data || []

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <section className="grid gap-4">
        {matches.length === 0 && (
          <article className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm">
            Belum ada match. Buka halaman Swipe untuk mulai menemukan koneksi.
          </article>
        )}

        {matches.map((match) => {
          const partner = user?.role === 'startup' ? match.talent : match.startup
          const subtitle = partner?.startup_profile?.tagline || partner?.talent_profile?.role_title || 'Profil belum lengkap'

          return (
            <article key={match.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">Match #{match.id}</p>
                  <h3 className="text-lg font-bold text-slate-900">{partner?.name || 'Pengguna'}</h3>
                  <p className="text-sm text-slate-600">{subtitle}</p>
                </div>

                <Link
                  to={`/matches/${match.id}/chat`}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  Buka Chat
                </Link>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
