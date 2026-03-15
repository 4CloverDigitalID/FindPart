import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function getNextPath(user) {
  if (user?.role === 'startup' && !user?.startup_profile) {
    return '/onboarding/startup'
  }

  if (user?.role === 'talent' && !user?.talent_profile) {
    return '/onboarding/talent'
  }

  return '/dashboard'
}

export default function Login() {
  const { loginMutation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (loginMutation.data?.user) {
      navigate(location.state?.from?.pathname || getNextPath(loginMutation.data.user), { replace: true })
    }
  }, [loginMutation.data, location.state, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await loginMutation.mutateAsync(form)
    } catch (error) {
      // Error state is rendered from mutation object.
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto mt-16 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Masuk</h1>
        <p className="mt-2 text-sm text-slate-600">Lanjutkan pencarian partner startup atau peluang karier.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </label>

          {loginMutation.isError && (
            <p className="text-sm text-red-600">{loginMutation.error?.response?.data?.message || 'Login gagal.'}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-900"
          >
            {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Belum punya akun?{' '}
          <Link className="font-semibold text-amber-600" to="/register">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
