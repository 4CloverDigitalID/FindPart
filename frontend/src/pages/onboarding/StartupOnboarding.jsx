import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

const initialForm = {
  company_name: '',
  tagline: '',
  pitch_description: '',
  stage: 'idea',
  industry: '',
  needs: '',
  location: '',
  website: '',
  team_size: 1,
}

export default function StartupOnboarding() {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(1)
  const [pitchDeckFile, setPitchDeckFile] = useState(null)
  const [pitchDeckPath, setPitchDeckPath] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const uploadPitchDeck = async () => {
    if (!pitchDeckFile) {
      return ''
    }

    const payload = new FormData()
    payload.append('file', pitchDeckFile)

    const { data } = await api.post('/uploads/pitch-deck', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    setPitchDeckPath(data.path)
    return data.path
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const uploadedPath = pitchDeckPath || (await uploadPitchDeck())

      await api.post('/startup/profile', {
        ...form,
        needs: form.needs
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        team_size: Number(form.team_size),
        pitch_deck_url: uploadedPath || null,
      })

      const { data } = await api.get('/me')
      setUser(data)
      navigate('/dashboard')
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Gagal menyimpan onboarding startup.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Onboarding Startup</h1>
        <p className="mt-2 text-sm text-slate-600">Langkah {step} dari 2</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Nama Perusahaan
                <input
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                  required
                  value={form.company_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, company_name: event.target.value }))}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Tagline
                <input
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                  value={form.tagline}
                  onChange={(event) => setForm((prev) => ({ ...prev, tagline: event.target.value }))}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Pitch Description
                <textarea
                  className="mt-1 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-2"
                  required
                  value={form.pitch_description}
                  onChange={(event) => setForm((prev) => ({ ...prev, pitch_description: event.target.value }))}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Stage
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={form.stage}
                    onChange={(event) => setForm((prev) => ({ ...prev, stage: event.target.value }))}
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
                    required
                    value={form.industry}
                    onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Lokasi
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    required
                    value={form.location}
                    onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Team Size
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    type="number"
                    min={1}
                    value={form.team_size}
                    onChange={(event) => setForm((prev) => ({ ...prev, team_size: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                  Website
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    type="url"
                    value={form.website}
                    onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                  Kebutuhan Role (pisahkan dengan koma)
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                    value={form.needs}
                    onChange={(event) => setForm((prev) => ({ ...prev, needs: event.target.value }))}
                  />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <label className="block text-sm font-medium text-slate-700">
              Upload Pitch Deck (PDF/PPT)
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(event) => setPitchDeckFile(event.target.files?.[0] || null)}
              />
              {pitchDeckPath && <p className="mt-2 text-xs text-green-600">File siap: {pitchDeckPath}</p>}
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
