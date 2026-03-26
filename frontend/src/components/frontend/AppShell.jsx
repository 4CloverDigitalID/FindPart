import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'

export default function AppShell({ title, children }) {
  const user = useAuthStore((state) => state.user)
  const { logoutMutation } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      // State cleanup is handled in mutation onSettled.
    }

    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">StartupMatch</p>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          </div>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100" to="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100" to="/swipe">
              Swipe
            </Link>
            <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100" to="/matches">
              Matches
            </Link>
            <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100" to="/profile">
              Profil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700"
            >
              Keluar
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6 rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          Login sebagai <strong>{user?.name || '-'}</strong> ({user?.role || '-'})
        </div>
        {children}
      </main>
    </div>
  )
}