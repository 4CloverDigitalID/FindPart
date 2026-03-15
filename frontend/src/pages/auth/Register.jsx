import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const [searchParams] = useSearchParams()
  const roleFromQuery = searchParams.get('role')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: roleFromQuery === 'talent' ? 'talent' : 'startup',
  })

  const { registerMutation } = useAuth()
  const navigate = useNavigate()

  const nextPath = useMemo(() => {
    return form.role === 'startup' ? '/onboarding/startup' : '/onboarding/talent'
  }, [form.role])

  useEffect(() => {
    if (registerMutation.data?.user) {
      navigate(nextPath, { replace: true })
    }
  }, [navigate, nextPath, registerMutation.data])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await registerMutation.mutateAsync(form)
    } catch (error) {
      // Error state is rendered from mutation object.
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto mt-10 w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Daftar Akun</h1>
        <p className="mt-2 text-sm text-slate-600">Pilih role, lengkapi profil, lalu mulai proses matching.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Nama Lengkap
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>

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

          <div className="grid grid-cols-2 gap-3">
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

            <label className="block text-sm font-medium text-slate-700">
              Konfirmasi
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                type="password"
                required
                value={form.password_confirmation}
                onChange={(event) => setForm((prev) => ({ ...prev, password_confirmation: event.target.value }))}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Role
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="startup">Startup</option>
              <option value="talent">Talent</option>
            </select>
          </label>

          {registerMutation.isError && (
            <p className="text-sm text-red-600">{registerMutation.error?.response?.data?.message || 'Registrasi gagal.'}</p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-900"
          >
            {registerMutation.isPending ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link className="font-semibold text-amber-600" to="/login">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
