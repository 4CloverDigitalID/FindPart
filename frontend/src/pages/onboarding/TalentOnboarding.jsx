import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

const initialForm = {
  bio: '',
  skills: '',
  experience_years: 0,
  role_title: '',
  preferred_industries: '',
  work_type: 'remote',
  availability: 'immediately',
  portfolio_url: '',
}

export default function TalentOnboarding() {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(1)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumePath, setResumePath] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const uploadResume = async () => {
    if (!resumeFile) {
      return ''
    }

    const payload = new FormData()
    payload.append('file', resumeFile)

    const { data } = await api.post('/uploads/resume', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    setResumePath(data.path)
    return data.path
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const uploadedPath = resumePath || (await uploadResume())

      await api.post('/talent/profile', {
        ...form,
        skills: form.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        preferred_industries: form.preferred_industries
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        experience_years: Number(form.experience_years),
        resume_url: uploadedPath || null,
      })

      const { data } = await api.get('/me')
      setUser(data)
      navigate('/dashboard')
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Gagal menyimpan onboarding talent.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Onboarding Talent</h1>
        <p className="mt-2 text-sm text-slate-600">Langkah {step} dari 2</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Role Title
                <input
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                  required
                  value={form.role_title}
                  onChange={(event) => setForm((prev) => ({ ...prev, role_title: event.target.value }))}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Bio
                <textarea
                  className="mt-1 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-2"
                  required
                  value={form.bio}
                  onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                  Skills (pisahkan dengan koma)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    required
                    value={form.skills}
                    onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Pengalaman (tahun)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    type="number"
                    min={0}
                    value={form.experience_years}
                    onChange={(event) => setForm((prev) => ({ ...prev, experience_years: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Work Type
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={form.work_type}
                    onChange={(event) => setForm((prev) => ({ ...prev, work_type: event.target.value }))}
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
                    value={form.availability}
                    onChange={(event) => setForm((prev) => ({ ...prev, availability: event.target.value }))}
                  >
                    <option value="immediately">Immediately</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Preferred Industries (koma)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={form.preferred_industries}
                    onChange={(event) => setForm((prev) => ({ ...prev, preferred_industries: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                  Portfolio URL
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    type="url"
                    value={form.portfolio_url}
                    onChange={(event) => setForm((prev) => ({ ...prev, portfolio_url: event.target.value }))}
                  />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <label className="block text-sm font-medium text-slate-700">
              Upload Resume (PDF/DOC)
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
              />
              {resumePath && <p className="mt-2 text-xs text-green-600">File siap: {resumePath}</p>}
            </label>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Kembali
              </button>
            ) : (
              <span />
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                {loading ? 'Menyimpan...' : 'Simpan & Masuk Dashboard'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
