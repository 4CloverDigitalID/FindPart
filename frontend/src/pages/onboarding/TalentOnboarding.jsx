import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

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

const workTypeOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
]

const availabilityOptions = [
  { value: 'immediately', label: 'Sekarang' },
  { value: '1month', label: '1 Bulan' },
  { value: '3months', label: '3 Bulan' },
]

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
    if (!resumeFile) return ''
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
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
        preferred_industries: form.preferred_industries.split(',').map((item) => item.trim()).filter(Boolean),
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
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }
        @keyframes floatC {
          0%, 100% { transform: rotate(15deg) scale(1); }
          50% { transform: rotate(25deg) scale(1.05); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 35%, #fde68a 60%, #fbbf24 80%, #f59e0b 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        .animate-floatA { animation: floatA 8s ease-in-out infinite; }
        .animate-floatB { animation: floatB 10s ease-in-out infinite; }
        .animate-floatC { animation: floatC 7s ease-in-out infinite; }
        .animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        .bg-radial-amber {
          background:
            radial-gradient(ellipse 800px 600px at 10% 0%, rgba(251,191,36,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 600px 500px at 90% 100%, rgba(251,191,36,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 400px 400px at 60% 40%, rgba(253,230,138,0.08) 0%, transparent 50%);
        }
        .bg-dots {
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .sidebar-after::after {
          content: '';
          position: absolute;
          bottom: -40px; right: -40px;
          width: 160px; height: 160px;
          background: rgba(251,191,36,0.15);
          border-radius: 50%;
        }
        .step-line::after {
          content: '';
          position: absolute;
          left: 14px; top: 40px;
          width: 1.5px;
          height: calc(100% - 8px);
          background: rgba(180,120,0,0.15);
        }
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #f0ebe8;
        }
        .ob-input:focus, .ob-textarea:focus, .ob-select:focus {
          border-color: #fbbf24 !important;
          background: #fffdf5 !important;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.12) !important;
          outline: none !important;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-[#fafaf8] flex items-center justify-center px-5 py-10">

        {/* Background */}
        <div className="bg-radial-amber pointer-events-none fixed inset-0 z-0" />
        <div className="bg-dots pointer-events-none fixed inset-0 z-0 opacity-35" />
        <div className="animate-floatA pointer-events-none fixed right-[15%] top-[-80px] z-0 h-[320px] w-[320px] rounded-full border-2 border-amber-300/20" />
        <div className="animate-floatB pointer-events-none fixed bottom-[10%] left-[5%] z-0 h-[180px] w-[180px] rounded-full bg-amber-400/[0.08]" />
        <div className="animate-floatC pointer-events-none fixed left-[8%] top-[20%] z-0 h-20 w-20 rounded-2xl bg-amber-400 opacity-[0.12]" style={{ transform: 'rotate(15deg)' }} />

        {/* Card */}
        <div className="relative z-10 w-full max-w-[780px] overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.08),0_40px_80px_rgba(0,0,0,0.05)]">

          {/* Shimmer stripe */}
          <div className="animate-shimmer h-[5px] w-full" />

          <div className="flex min-h-[560px]">

            {/* ── Sidebar ── */}
            <div style={{ fontFamily: "inter" }} className="sidebar-after relative hidden w-[220px] flex-shrink-0 flex-col overflow-hidden border-r border-amber-200/40 bg-gradient-to-b from-amber-50 to-amber-100/60 p-10 md:flex">
              {/* Logo */}
              <div className="mb-9">
                <img className='h-12 w-33' src="../image/icon-login.png" alt="FindPart Logo" />
              </div>

              {/* Steps */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="step-line relative flex items-start gap-3 py-3">
                  <div className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${step === 1 ? 'bg-amber-400 text-stone-900 shadow-[0_3px_10px_rgba(251,191,36,0.5)]' : 'border-[1.5px] border-amber-400 bg-amber-100 text-amber-800'}`}>
                    {step > 1 ? '✓' : '1'}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-stone-900">Info Talent</div>
                    <div className="mt-0.5 text-[11px] leading-[1.4] text-stone-400">Role, bio, skills & preferensi</div>
                  </div>
                </div>
                <div className="relative flex items-start gap-3 py-3">
                  <div className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all font-syne ${step === 2 ? 'bg-amber-400 text-stone-900 shadow-[0_3px_10px_rgba(251,191,36,0.5)]' : 'border-[1.5px] border-black/10 bg-black/[0.06] text-stone-400'}`}>
                    2
                  </div>
                  <div>
                    <div className={`text-[13px] font-semibold ${step === 2 ? 'text-stone-900' : 'text-stone-400'}`}>Upload Resume</div>
                    <div className="mt-0.5 text-[11px] leading-[1.4] text-stone-400">Bagikan CV untuk menarik startup</div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative z-10 mt-auto border-t border-amber-800/10 pt-7">
                <p className="text-[12px] italic leading-relaxed text-amber-800">"Talent terbaik selalu siap bertemu dengan startup yang tepat."</p>
                <span className="mt-1.5 block text-[11px] font-semibold not-italic text-amber-700">— FindPart</span>
              </div>
            </div>

            {/* ── Main ── */}
            <div className="flex-1 overflow-hidden px-7 pb-11 pt-10 md:px-11">

              {/* Header */}
              <div className="mb-8">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-800">
                  <span style={{ fontFamily: "inter" }} className="animate-pulse-dot h-[5px] w-[5px] rounded-full bg-amber-500" />
                  Langkah {step} dari 2
                </div>
                <h1 style={{ fontFamily: "poppins" }} className="mb-1.5 text-[28px] font-semibold leading-[1.15] tracking-tight text-stone-900">
                  {step === 1 ? <>Perkenalkan <span className="text-amber-600">Dirimu</span></> : <>Upload <span className="text-amber-600">Resume</span></>}
                </h1>
                <p className="text-sm text-stone-600">
                  {step === 1
                    ? 'Lengkapi profilmu agar startup terbaik bisa menemukanmu.'
                    : 'Tambahkan resume untuk meningkatkan peluang match dengan startup.'}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div style={{ fontFamily: "inter" }} className="flex flex-col gap-[18px]">

                    {/* Role title */}
                    <div>
                      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Role Title</label>
                      <input
                        className="ob-input w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all"
                        required
                        placeholder="e.g. Full-stack Developer, UI/UX Designer"
                        value={form.role_title}
                        onChange={(e) => setForm((p) => ({ ...p, role_title: e.target.value }))}
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Bio</label>
                      <textarea
                        className="ob-textarea w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all min-h-[100px] resize-y leading-relaxed"
                        required
                        placeholder="Ceritakan tentang dirimu, pengalamanmu, dan apa yang kamu cari..."
                        value={form.bio}
                        onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Skills (pisahkan dengan koma)</label>
                      <input
                        className="ob-input w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all"
                        required
                        placeholder="e.g. React, Node.js, Figma, Python"
                        value={form.skills}
                        onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                      />
                    </div>

                    {/* Work type */}
                    <div>
                      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Work Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {workTypeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, work_type: opt.value }))}
                            className={`rounded-xl border-[1.5px] px-2 py-2.5 text-center transition-all cursor-pointer ${
                              form.work_type === opt.value
                                ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-[0_4px_16px_rgba(251,191,36,0.2)]'
                                : 'border-stone-200 bg-[#fafaf8] hover:border-amber-400 hover:bg-amber-50 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(251,191,36,0.15)]'
                            }`}
                          >
                            <span className={`font-syne block text-[11.5px] font-bold tracking-wide ${form.work_type === opt.value ? 'text-amber-800' : 'text-stone-400'}`}>
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Availability</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availabilityOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, availability: opt.value }))}
                            className={`rounded-xl border-[1.5px] px-2 py-2.5 text-center transition-all cursor-pointer ${
                              form.availability === opt.value
                                ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-[0_4px_16px_rgba(251,191,36,0.2)]'
                                : 'border-stone-200 bg-[#fafaf8] hover:border-amber-400 hover:bg-amber-50 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(251,191,36,0.15)]'
                            }`}
                          >
                            <span className={`block text-[11.5px] font-bold tracking-wide ${form.availability === opt.value ? 'text-amber-800' : 'text-stone-400'}`}>
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section divider */}
                    <div className="section-divider flex items-center gap-2.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-stone-500">Detail Tambahan</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Pengalaman (tahun)</label>
                        <input
                          className="ob-input w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-[12px] text-stone-900 placeholder-stone-300 transition-all"
                          type="number"
                          min={0}
                          placeholder="0"
                          value={form.experience_years}
                          onChange={(e) => setForm((p) => ({ ...p, experience_years: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Preferred Industries (koma)</label>
                        <input
                          className="ob-input w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all"
                          placeholder="e.g. EdTech, FinTech"
                          value={form.preferred_industries}
                          onChange={(e) => setForm((p) => ({ ...p, preferred_industries: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-widest text-stone-600">Portfolio URL</label>
                        <input
                          className="ob-input w-full rounded-xl border-[1.5px] border-stone-200 bg-[#fafaf8] px-3.5 py-[11px] text-sm text-stone-900 placeholder-stone-300 transition-all"
                          type="url"
                          placeholder="https://yourportfolio.com"
                          value={form.portfolio_url}
                          onChange={(e) => setForm((p) => ({ ...p, portfolio_url: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    {/* Info box */}
                    <div style={{  fontFamily: "inter" }} className="mb-5 flex gap-3 rounded-[14px] border border-amber-200 bg-amber-50 px-[18px] py-4">
                      <p className="text-[13px] leading-relaxed text-amber-800">
                        <strong className="font-semibold text-amber-700">Opsional tapi direkomendasikan.</strong> Resume yang lengkap membantu startup menilai kemampuanmu lebih cepat dan meningkatkan peluang match.
                      </p>
                    </div>

                    {/* Upload zone */}
                    <label className="relative block cursor-pointer overflow-hidden rounded-[18px] border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 px-7 py-11 text-center transition-all hover:border-amber-500 hover:from-amber-100 hover:to-yellow-50 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(251,191,36,0.15)]">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      />
                      <p style={{ fontFamily: "poppins" }} className="mb-1 text-base font-semibold text-stone-900">
                        {resumeFile ? resumeFile.name : 'Seret atau klik untuk upload'}
                      </p>
                      <p className="text-[13px] text-stone-400">
                        {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : 'Maksimal 10MB'}
                      </p>
                      <div className="mt-3.5 inline-flex gap-1.5">
                        {['PDF', 'DOC', 'DOCX'].map((t) => (
                          <span key={t} className="rounded-md bg-black/[0.06] px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-stone-500">{t}</span>
                        ))}
                      </div>
                    </label>

                    {resumePath && (
                      <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border-[1.5px] border-green-300 bg-green-50 px-3.5 py-3">
                        <span>✅</span>
                        <span className="text-[13px] font-medium text-green-700">File siap: {resumePath}</span>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border-[1.5px] border-red-300 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t-[1.5px] border-stone-100 pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((p) => p - 1)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-stone-200 bg-transparent px-5 py-[11px] text-[13.5px] font-semibold text-stone-500 transition-all hover:border-stone-300 hover:bg-[#fafaf8] hover:text-stone-900"
                    >
                      Kembali
                    </button>
                  ) : <span />}

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center cursor-pointer gap-2.5 rounded-xl border-none bg-amber-400 px-6 py-3 text-sm font-bold tracking-wide text-stone-900 shadow-[0_4px_16px_rgba(251,191,36,0.35),0_1px_3px_rgba(0,0,0,0.1)] transition-all hover:bg-amber-500 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(251,191,36,0.45),0_2px_6px_rgba(0,0,0,0.1)]"
                    >
                      Lanjut
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2.5 cursor-pointer rounded-xl border-none bg-amber-400 px-6 py-3 text-sm font-bold tracking-wide text-stone-900 shadow-[0_4px_16px_rgba(251,191,36,0.35),0_1px_3px_rgba(0,0,0,0.1)] transition-all hover:bg-amber-500 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(251,191,36,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan & Masuk Dashboard'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}