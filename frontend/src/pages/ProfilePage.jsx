import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import AppShell from '../components/frontend/AppShell'
import { useAuthStore } from '../store/authStore'

function getInitialRoleForm(user) {
  if (user?.role === 'startup') {
    const profile = user.startup_profile || {}

    return {
      company_name: profile.company_name || '',
      tagline: profile.tagline || '',
      pitch_description: profile.pitch_description || '',
      stage: profile.stage || 'idea',
      industry: profile.industry || '',
      needs: Array.isArray(profile.needs) ? profile.needs.join(', ') : '',
      location: profile.location || '',
      website: profile.website || '',
      team_size: profile.team_size || 1,
      pitch_deck_url: profile.pitch_deck_url || '',
    }
  }

  const profile = user?.talent_profile || {}

  return {
    bio: profile.bio || '',
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
    experience_years: profile.experience_years ?? 0,
    role_title: profile.role_title || '',
    preferred_industries: Array.isArray(profile.preferred_industries)
      ? profile.preferred_industries.join(', ')
      : '',
    work_type: profile.work_type || 'remote',
    availability: profile.availability || 'immediately',
    resume_url: profile.resume_url || '',
    portfolio_url: profile.portfolio_url || '',
  }
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const [avatarFile, setAvatarFile] = useState(null)
  const [uploadState, setUploadState] = useState({ loading: false, error: '', success: '' })
  const [accountForm, setAccountForm] = useState({ name: '', email: '' })
  const [roleForm, setRoleForm] = useState({})
  const [accountState, setAccountState] = useState({ loading: false, error: '', success: '' })
  const [roleState, setRoleState] = useState({ loading: false, error: '', success: '' })

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/me')
      return data
    },
  })

  useEffect(() => {
    if (!meQuery.data) {
      return
    }

    setUser(meQuery.data)
    setAccountForm({
      name: meQuery.data.name || '',
      email: meQuery.data.email || '',
    })
    setRoleForm(getInitialRoleForm(meQuery.data))
  }, [meQuery.data, setUser])

  const user = meQuery.data

  const roleLabel = useMemo(() => {
    if (user?.role === 'startup') {
      return 'Startup'
    }

    if (user?.role === 'talent') {
      return 'Talent'
    }

    return '-'
  }, [user?.role])

  const refreshMe = async () => {
    await queryClient.invalidateQueries({ queryKey: ['me'] })
  }

  const handleAvatarUpload = async (event) => {
    event.preventDefault()

    if (!avatarFile) {
      return
    }

    setUploadState({ loading: true, error: '', success: '' })

    try {
      const payload = new FormData()
      payload.append('file', avatarFile)

      await api.post('/uploads/avatar', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      await refreshMe()
      setUploadState({ loading: false, error: '', success: 'Avatar berhasil diperbarui.' })
    } catch (error) {
      setUploadState({
        loading: false,
        error: error?.response?.data?.message || 'Gagal upload avatar.',
        success: '',
      })
    }
  }

  const handleAccountSubmit = async (event) => {
    event.preventDefault()
    setAccountState({ loading: true, error: '', success: '' })

    try {
      await api.patch('/profile', accountForm)
      await refreshMe()
      setAccountState({ loading: false, error: '', success: 'Profil akun berhasil diperbarui.' })
    } catch (error) {
      setAccountState({
        loading: false,
        error: error?.response?.data?.message || 'Gagal memperbarui akun.',
        success: '',
      })
    }
  }

  const handleRoleSubmit = async (event) => {
    event.preventDefault()
    setRoleState({ loading: true, error: '', success: '' })

    try {
      if (user.role === 'startup') {
        await api.post('/startup/profile', {
          ...roleForm,
          needs: (roleForm.needs || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          team_size: Number(roleForm.team_size || 1),
          pitch_deck_url: roleForm.pitch_deck_url || null,
        })
      } else {
        await api.post('/talent/profile', {
          ...roleForm,
          skills: (roleForm.skills || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          preferred_industries: (roleForm.preferred_industries || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          experience_years: Number(roleForm.experience_years || 0),
          resume_url: roleForm.resume_url || null,
          portfolio_url: roleForm.portfolio_url || null,
        })
      }

      await refreshMe()
      setRoleState({ loading: false, error: '', success: 'Profil role berhasil diperbarui.' })
    } catch (error) {
      setRoleState({
        loading: false,
        error: error?.response?.data?.message || 'Gagal memperbarui profil role.',
        success: '',
      })
    }
  }

  if (meQuery.isLoading) {
    return <AppShell title="Profil">Memuat profil...</AppShell>
  }

  if (meQuery.isError) {
    return <AppShell title="Profil">Gagal memuat profil.</AppShell>
  }

  return (
    <AppShell title="Profil Saya">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Informasi Akun</h2>
          <p className="mt-1 text-sm text-slate-600">Role: {roleLabel}</p>

          <form className="mt-4 space-y-3" onSubmit={handleAccountSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Nama
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                value={accountForm.name}
                onChange={(event) => setAccountForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                type="email"
                value={accountForm.email}
                onChange={(event) => setAccountForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>

            <button
              type="submit"
              disabled={accountState.loading}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              {accountState.loading ? 'Menyimpan...' : 'Simpan Akun'}
            </button>

            {accountState.error && <p className="text-sm text-red-600">{accountState.error}</p>}
            {accountState.success && <p className="text-sm text-green-600">{accountState.success}</p>}
          </form>

          <form className="mt-6 space-y-3 border-t border-slate-200 pt-6" onSubmit={handleAvatarUpload}>
            <label className="block text-sm font-medium text-slate-700">
              Update Avatar
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                type="file"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
              />
            </label>
            <button
              type="submit"
              disabled={uploadState.loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {uploadState.loading ? 'Uploading...' : 'Upload Avatar'}
            </button>
            {uploadState.error && <p className="text-sm text-red-600">{uploadState.error}</p>}
            {uploadState.success && <p className="text-sm text-green-600">{uploadState.success}</p>}
          </form>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Edit Profil {roleLabel}</h2>

          <form className="mt-4 space-y-3" onSubmit={handleRoleSubmit}>
            {user.role === 'startup' ? (
              <>
                <label className="block text-sm font-medium text-slate-700">
                  Company Name
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.company_name || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, company_name: event.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Tagline
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.tagline || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, tagline: event.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Pitch Description
                  <textarea
                    className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.pitch_description || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, pitch_description: event.target.value }))}
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Stage
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      value={roleForm.stage || 'idea'}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, stage: event.target.value }))}
                    >
                      <option value="idea">Idea</option>
                      <option value="mvp">MVP</option>
                      <option value="growth">Growth</option>
                      <option value="scaling">Scaling</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Industry
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      value={roleForm.industry || ''}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, industry: event.target.value }))}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Location
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      value={roleForm.location || ''}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, location: event.target.value }))}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Team Size
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      type="number"
                      min={1}
                      value={roleForm.team_size || 1}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, team_size: event.target.value }))}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Needs (comma separated)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.needs || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, needs: event.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Website
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    type="url"
                    value={roleForm.website || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, website: event.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Pitch Deck URL/Path
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.pitch_deck_url || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, pitch_deck_url: event.target.value }))}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-slate-700">
                  Role Title
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.role_title || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, role_title: event.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Bio
                  <textarea
                    className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.bio || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, bio: event.target.value }))}
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Experience (years)
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      type="number"
                      min={0}
                      value={roleForm.experience_years || 0}
                      onChange={(event) =>
                        setRoleForm((prev) => ({ ...prev, experience_years: event.target.value }))
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Work Type
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      value={roleForm.work_type || 'remote'}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, work_type: event.target.value }))}
                    >
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Availability
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      value={roleForm.availability || 'immediately'}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, availability: event.target.value }))}
                    >
                      <option value="immediately">Immediately</option>
                      <option value="1month">1 Month</option>
                      <option value="3months">3 Months</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Portfolio URL
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                      type="url"
                      value={roleForm.portfolio_url || ''}
                      onChange={(event) => setRoleForm((prev) => ({ ...prev, portfolio_url: event.target.value }))}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Skills (comma separated)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.skills || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, skills: event.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred Industries (comma separated)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.preferred_industries || ''}
                    onChange={(event) =>
                      setRoleForm((prev) => ({ ...prev, preferred_industries: event.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Resume URL/Path
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={roleForm.resume_url || ''}
                    onChange={(event) => setRoleForm((prev) => ({ ...prev, resume_url: event.target.value }))}
                  />
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={roleState.loading}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              {roleState.loading ? 'Menyimpan...' : 'Simpan Profil Role'}
            </button>

            {roleState.error && <p className="text-sm text-red-600">{roleState.error}</p>}
            {roleState.success && <p className="text-sm text-green-600">{roleState.success}</p>}
          </form>
        </article>
      </section>
    </AppShell>
  )
}
