import { useQuery } from '@tanstack/react-query'
import { Link, Navigate } from 'react-router-dom'
import api from '../api/axios'
import AppShell from '../components/frontend/AppShell'

function needsOnboarding(user) {
  if (!user?.role) {
    return '/onboarding/role'
  }

  if (user.role === 'startup' && !user.startup_profile) {
    return '/onboarding/startup'
  }

  if (user.role === 'talent' && !user.talent_profile) {
    return '/onboarding/talent'
  }

  return null
}

export default function Dashboard() {
  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/me')
      return data
    },
  })

  if (meQuery.isLoading) {
    return <div className="p-8 text-slate-600">Memuat dashboard...</div>
  }

  if (meQuery.isError) {
    return <div className="p-8 text-red-600">Gagal memuat dashboard.</div>
  }

  const next = needsOnboarding(meQuery.data)

  if (next) {
    return <Navigate to={next} replace />
  }

  const profile = meQuery.data.role === 'startup' ? meQuery.data.startup_profile : meQuery.data.talent_profile

  return (
    <AppShell title="Dashboard">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm md:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">Ringkasan Profil</h2>
          <p className="mt-2 text-sm text-slate-600">
            {profile?.pitch_description || profile?.bio || 'Lengkapi profil agar lebih menarik di feed discovery.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(profile?.needs || profile?.skills || []).map((item) => (
              <span key={item} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Aksi Cepat</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Link className="block rounded-lg bg-slate-100 px-3 py-2 text-slate-800" to="/swipe">
              Mulai Swipe
            </Link>
            <Link className="block rounded-lg bg-slate-100 px-3 py-2 text-slate-800" to="/matches">
              Lihat Matches
            </Link>
            <Link className="block rounded-lg bg-slate-100 px-3 py-2 text-slate-800" to="/profile">
              Edit Profil
            </Link>
          </div>
        </article>
      </section>
    </AppShell>
  )
}
