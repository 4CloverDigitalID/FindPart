import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
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

const stageOptions = [
  { value: 'idea', label: 'Idea',  },
  { value: 'mvp', label: 'MVP', },
  { value: 'growth', label: 'Growth',  },
  { value: 'scaling', label: 'Scaling',  },
]

const workTypeOptions = [
  { value: 'remote', label: 'Remote',  },
  { value: 'onsite', label: 'On-site',  },
  { value: 'hybrid', label: 'Hybrid',  },
]

const availabilityOptions = [
  { value: 'immediately', label: 'Sekarang',  },
  { value: '1month', label: '1 Bulan',},
  { value: '3months', label: '3 Bulan',  },
]

// Shared field components
function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-500">
      {children}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`ob-input w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all ${className}`}
      {...props}
    />
  )
}

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`ob-textarea w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all min-h-[96px] resize-y leading-relaxed ${className}`}
      {...props}
    />
  )
}

function SectionTitle({ children }) {
  return (
    <div className="section-divider flex items-center gap-2.5">
      <span className="font-syne text-[10.5px] font-bold uppercase tracking-[0.1em] text-stone-300 whitespace-nowrap">
        {children}
      </span>
    </div>
  )
}

function SaveButton({ loading, label = 'Simpan', loadingLabel = 'Menyimpan...' }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="font-syne flex items-center gap-2.5 rounded-xl border-none bg-amber-400 px-5 py-2.5 text-sm font-bold tracking-wide text-stone-900 shadow-[0_4px_16px_rgba(251,191,36,0.35),0_1px_3px_rgba(0,0,0,0.1)] transition-all hover:bg-amber-500 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(251,191,36,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
    >
      {loading ? loadingLabel : label}
      {!loading && (
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-md bg-black/10 text-xs">✓</span>
      )}
    </button>
  )
}

function StatusMsg({ error, success }) {
  if (error) return (
    <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-red-300 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
      {error}
    </div>
  )
  if (success) return (
    <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-green-300 bg-green-50 px-3.5 py-2.5 text-[13px] text-green-700">
      {success}
    </div>
  )
  return null
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
    if (!meQuery.data) return
    setUser(meQuery.data)
    setAccountForm({ name: meQuery.data.name || '', email: meQuery.data.email || '' })
    setRoleForm(getInitialRoleForm(meQuery.data))
  }, [meQuery.data, setUser])

  const user = meQuery.data

  const roleLabel = useMemo(() => {
    if (user?.role === 'startup') return 'Startup'
    if (user?.role === 'talent') return 'Talent'
    return '-'
  }, [user?.role])

  const refreshMe = async () => {
    await queryClient.invalidateQueries({ queryKey: ['me'] })
  }

  const handleAvatarUpload = async (event) => {
    event.preventDefault()
    if (!avatarFile) return
    setUploadState({ loading: true, error: '', success: '' })
    try {
      const payload = new FormData()
      payload.append('file', avatarFile)
      await api.post('/uploads/avatar', payload)
      await refreshMe()
      setUploadState({ loading: false, error: '', success: 'Avatar berhasil diperbarui.' })
    } catch (error) {
      setUploadState({ loading: false, error: error?.response?.data?.message || 'Gagal upload avatar.', success: '' })
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
      setAccountState({ loading: false, error: error?.response?.data?.message || 'Gagal memperbarui akun.', success: '' })
    }
  }

  const handleRoleSubmit = async (event) => {
    event.preventDefault()
    setRoleState({ loading: true, error: '', success: '' })
    try {
      if (user.role === 'startup') {
        await api.post('/startup/profile', {
          ...roleForm,
          needs: (roleForm.needs || '').split(',').map((item) => item.trim()).filter(Boolean),
          team_size: Number(roleForm.team_size || 1),
          pitch_deck_url: roleForm.pitch_deck_url || null,
        })
      } else {
        await api.post('/talent/profile', {
          ...roleForm,
          skills: (roleForm.skills || '').split(',').map((item) => item.trim()).filter(Boolean),
          preferred_industries: (roleForm.preferred_industries || '').split(',').map((item) => item.trim()).filter(Boolean),
          experience_years: Number(roleForm.experience_years || 0),
          resume_url: roleForm.resume_url || null,
          portfolio_url: roleForm.portfolio_url || null,
        })
      }
      await refreshMe()
      setRoleState({ loading: false, error: '', success: 'Profil role berhasil diperbarui.' })
    } catch (error) {
      setRoleState({ loading: false, error: error?.response?.data?.message || 'Gagal memperbarui profil role.', success: '' })
    }
  }

 if (meQuery.isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
              <div className="w-8 h-8 border-2 border-yellow-300 border-t-yellow-500 rounded-full animate-spin" />
            </div>
if (meQuery.isError) return <div className="p-6">Gagal memuat profil.</div>

  return (
    <>
        <div className=" p-6 max-w-7xl mx-auto">

          {/* Page header */}
          <div className="flex items-center gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 style={{ fontFamily: "poppins" }} className="text-2xl font-semibold tracking-tight text-stone-900">My Profile</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-amber-800">
                  <span className="animate-pulse-dot h-[5px] w-[5px] rounded-full bg-amber-500" />
                  {roleLabel}
                </span>
              </div>
              <p className="text-sm text-stone-400">Kelola informasi akun dan profil {roleLabel.toLowerCase()} kamu</p>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid gap-5 lg:grid-cols-2">

            {/* ── Left column: Account info ── */}
            <div className="space-y-5">

              {/* Account info card */}
              <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="animate-shimmer h-[3px] w-full" />
                <div className="p-6">
                  {/* Card header */}
                  <div className="mb-5 flex items-center gap-3">
                    <div style={{ fontFamily: "inter" }}>
                      <h2 className="font-syne text-base font-bold text-stone-900">Informasi Akun</h2>
                      <p className="text-[12px] text-stone-400">Nama dan email akun kamu</p>
                    </div>
                  </div>

                  <form onSubmit={handleAccountSubmit} className="space-y-4">
                    <div>
                      <FieldLabel>Nama</FieldLabel>
                      <Input
                        placeholder="Nama lengkap kamu"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type="email"
                        placeholder="email@kamu.com"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>

                   <button
                      type="submit"
                      disabled={accountState.loading}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl border-none bg-[#FED600] px-6 py-3 text-sm font-semibold tracking-wide text-stone-900 0.35)] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {accountState.loading ? 'Menyimpan...' : 'Simpan Akun'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Avatar card */}
              <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div style={{ fontFamily: "inter" }}>
                      <h2 className="font-syne text-base font-bold text-stone-900">Foto Profil</h2>
                      <p className="text-[12px] text-stone-400">Upload foto profil kamu</p>
                    </div>
                  </div>

                  {/* Avatar preview area */}
                  {user?.avatar_url && (
                    <div className="mb-4 flex items-center gap-3">
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="h-14 w-14 rounded-2xl border-2 border-amber-200 object-cover"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-stone-700">{user.name}</p>
                        <p className="text-[12px] text-stone-400">Foto saat ini</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleAvatarUpload} className="space-y-4">
                    {/* Upload zone */}
                    <label className="relative block cursor-pointer overflow-hidden rounded-[14px] border-2 border-dashed border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 px-5 py-6 text-center transition-all hover:border-amber-400 hover:from-amber-100 hover:shadow-[0_4px_16px_rgba(251,191,36,0.12)]">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      />
                      <p style={{ fontFamily: "poppins" }} className="font-syne text-[13px] font-semibold text-stone-700">
                        {avatarFile ? avatarFile.name : 'Klik untuk pilih foto'}
                      </p>
                      <p className="text-[12px] text-stone-400">PNG, JPG, WEBP · Maks 5MB</p>
                    </label>

                    <div className="flex items-center justify-between gap-3">
                      <StatusMsg error={uploadState.error} success={uploadState.success} />
                      <div className="ml-auto">
                        <button
                          style={{ fontFamily: "inter" }}
                          type="submit"
                          disabled={uploadState.loading || !avatarFile}
                          className="flex items-center gap-2 rounded-xl border-[1.5px] border-stone-200 bg-stone-900 px-5 cursor-pointer py-2.5 text-sm font-semibold text-white transition-all hover:bg-stone-800 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0"
                        >
                          {uploadState.loading ? 'Uploading...' : 'Upload Foto'}
                          {!uploadState.loading}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ── Right column: Role profile ── */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="animate-shimmer h-[3px] w-full" />
              <div className="p-6">
                {/* Card header */}
                <div style={{ fontFamily: "inter" }} className="mb-5 flex items-center gap-3">
                  
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Edit Profil {roleLabel}</h2>
                    <p className="text-[12px] text-stone-400">
                      {user?.role === 'startup' ? 'Detail startup kamu' : 'Detail profil talent kamu'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRoleSubmit} className="space-y-4">

                  {/* ── STARTUP fields ── */}
                  {user.role === 'startup' && (
                    <>
                      <div>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input placeholder="Nama perusahaan"
                          value={roleForm.company_name || ''}
                          onChange={(e) => setRoleForm((p) => ({ ...p, company_name: e.target.value }))} />
                      </div>
                      <div>
                        <FieldLabel>Tagline</FieldLabel>
                        <Input placeholder="One-liner startup kamu"
                          value={roleForm.tagline || ''}
                          onChange={(e) => setRoleForm((p) => ({ ...p, tagline: e.target.value }))} />
                      </div>
                      <div>
                        <FieldLabel>Pitch Description</FieldLabel>
                        <Textarea placeholder="Deskripsikan startup kamu..."
                          value={roleForm.pitch_description || ''}
                          onChange={(e) => setRoleForm((p) => ({ ...p, pitch_description: e.target.value }))} />
                      </div>

                      {/* Stage selector */}
                      <div>
                        <FieldLabel>Stage</FieldLabel>
                        <div className="grid grid-cols-4 gap-2">
                          {stageOptions.map((opt) => (
                            <button key={opt.value} type="button"
                              onClick={() => setRoleForm((p) => ({ ...p, stage: opt.value }))}
                              className={`rounded-xl border-[1.5px] px-1.5 py-2.5 text-center transition-all ${
                                roleForm.stage === opt.value
                                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-[0_4px_16px_rgba(251,191,36,0.2)]'
                                  : 'border-stone-200 bg-[#fafaf8] hover:border-amber-400 hover:bg-amber-50 hover:-translate-y-px'
                              }`}>
                              <span className="block text-base mb-1">{opt.icon}</span>
                              <span className={`font-syne block text-[11px] font-bold ${roleForm.stage === opt.value ? 'text-amber-800' : 'text-stone-400'}`}>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <SectionTitle>Detail Perusahaan</SectionTitle>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>Industry</FieldLabel>
                          <Input placeholder="e.g. EdTech"
                            value={roleForm.industry || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, industry: e.target.value }))} />
                        </div>
                        <div>
                          <FieldLabel>Location</FieldLabel>
                          <Input placeholder="e.g. Jakarta"
                            value={roleForm.location || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, location: e.target.value }))} />
                        </div>
                        <div>
                          <FieldLabel>Team Size</FieldLabel>
                          <Input type="number" min={1} placeholder="1"
                            value={roleForm.team_size || 1}
                            onChange={(e) => setRoleForm((p) => ({ ...p, team_size: e.target.value }))} />
                        </div>
                        <div>
                          <FieldLabel>Website</FieldLabel>
                          <Input type="url" placeholder="https://"
                            value={roleForm.website || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, website: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                          <FieldLabel>Needs (pisahkan koma)</FieldLabel>
                          <Input placeholder="e.g. CTO, Designer"
                            value={roleForm.needs || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, needs: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                          <FieldLabel>Pitch Deck URL / Path</FieldLabel>
                          <Input placeholder="https:// atau path file"
                            value={roleForm.pitch_deck_url || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, pitch_deck_url: e.target.value }))} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── TALENT fields ── */}
                  {user.role === 'talent' && (
                    <>
                      <div>
                        <FieldLabel>Role Title</FieldLabel>
                        <Input placeholder="e.g. Full-stack Developer"
                          value={roleForm.role_title || ''}
                          onChange={(e) => setRoleForm((p) => ({ ...p, role_title: e.target.value }))} />
                      </div>
                      <div>
                        <FieldLabel>Bio</FieldLabel>
                        <Textarea placeholder="Ceritakan tentang dirimu..."
                          value={roleForm.bio || ''}
                          onChange={(e) => setRoleForm((p) => ({ ...p, bio: e.target.value }))} />
                      </div>
                      <div>
                        <FieldLabel>Skills (pisahkan koma)</FieldLabel>
                        <Input placeholder="e.g. React, Node.js, Figma"
                          value={roleForm.skills || ''}
                          onChange={(e) => setRoleForm((p) => ({ ...p, skills: e.target.value }))} />
                      </div>

                      {/* Work type selector */}
                      <div>
                        <FieldLabel>Work Type</FieldLabel>
                        <div className="grid grid-cols-3 gap-2">
                          {workTypeOptions.map((opt) => (
                            <button key={opt.value} type="button"
                              onClick={() => setRoleForm((p) => ({ ...p, work_type: opt.value }))}
                              className={`rounded-xl border-[1.5px] px-2 py-2.5 text-center transition-all ${
                                roleForm.work_type === opt.value
                                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-[0_4px_16px_rgba(251,191,36,0.2)]'
                                  : 'border-stone-200 bg-[#fafaf8] hover:border-amber-400 hover:bg-amber-50 hover:-translate-y-px'
                              }`}>
                              <span className="block text-base mb-1">{opt.icon}</span>
                              <span className={`font-syne block text-[11px] font-bold ${roleForm.work_type === opt.value ? 'text-amber-800' : 'text-stone-400'}`}>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Availability selector */}
                      <div>
                        <FieldLabel>Availability</FieldLabel>
                        <div className="grid grid-cols-3 gap-2">
                          {availabilityOptions.map((opt) => (
                            <button key={opt.value} type="button"
                              onClick={() => setRoleForm((p) => ({ ...p, availability: opt.value }))}
                              className={`rounded-xl border-[1.5px] px-2 py-2.5 text-center transition-all ${
                                roleForm.availability === opt.value
                                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-[0_4px_16px_rgba(251,191,36,0.2)]'
                                  : 'border-stone-200 bg-[#fafaf8] hover:border-amber-400 hover:bg-amber-50 hover:-translate-y-px'
                              }`}>
                              <span className="block text-base mb-1">{opt.icon}</span>
                              <span className={`font-syne block text-[11px] font-bold ${roleForm.availability === opt.value ? 'text-amber-800' : 'text-stone-400'}`}>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <SectionTitle>Detail Tambahan</SectionTitle>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>Pengalaman (tahun)</FieldLabel>
                          <Input type="number" min={0} placeholder="0"
                            value={roleForm.experience_years || 0}
                            onChange={(e) => setRoleForm((p) => ({ ...p, experience_years: e.target.value }))} />
                        </div>
                        <div>
                          <FieldLabel>Preferred Industries</FieldLabel>
                          <Input placeholder="e.g. EdTech, FinTech"
                            value={roleForm.preferred_industries || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, preferred_industries: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                          <FieldLabel>Portfolio URL</FieldLabel>
                          <Input type="url" placeholder="https://yourportfolio.com"
                            value={roleForm.portfolio_url || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, portfolio_url: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                          <FieldLabel>Resume URL / Path</FieldLabel>
                          <Input placeholder="https:// atau path file"
                            value={roleForm.resume_url || ''}
                            onChange={(e) => setRoleForm((p) => ({ ...p, resume_url: e.target.value }))} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                    <StatusMsg error={roleState.error} success={roleState.success} />
                    <div className="ml-auto">
                      <button
                        type="submit"
                        disabled={roleState.loading}
                        className="flex items-center gap-2.5 cursor-pointer rounded-xl border-none bg-[#FED600] px-6 py-3 text-sm font-semibold tracking-wide text-stone-900 transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {roleState.loading ? 'Menyimpan...' : 'Simpan Profil'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
    </>
  )
}